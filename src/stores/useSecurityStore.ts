import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  generateSalt,
  generateKey,
  generateDataKey,
  exportKey,
  importKey,
  encryptData,
  decryptData,
  bufferToBase64,
  base64ToBuffer,
  generateSeedPhrase,
} from '@/lib/crypto'

type SecurityStore = {
  isSetup: boolean
  isUnlocked: boolean
  isAdminMode: boolean
  setupSecurity: (password: string) => Promise<{ seedPhrase: string; emergencyKey: string }>
  unlock: (password: string) => Promise<boolean>
  recover: (secret: string, newPassword: string) => Promise<boolean>
  lock: () => void
  toggleAdminMode: () => void
  loginAsManager: () => void
  switchToClientMode: () => void
  encrypt: (text: string) => Promise<string>
  decrypt: (encryptedText: string) => Promise<string | null>
}

const SecurityContext = createContext<SecurityStore | null>(null)

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSetup, setIsSetup] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [dataKey, setDataKey] = useState<CryptoKey | null>(null)

  useEffect(() => {
    const salt = localStorage.getItem('zkp_salt')
    if (salt) setIsSetup(true)
  }, [])

  const setupSecurity = async (password: string) => {
    const salt = generateSalt()
    const saltB64 = bufferToBase64(salt)

    const newMasterKey = await generateDataKey()
    const rawDataKeyStr = await exportKey(newMasterKey)

    const pwdKey = await generateKey(password, salt)
    const encryptedDataKeyPwd = await encryptData(rawDataKeyStr, pwdKey)

    const seedPhrase = generateSeedPhrase()
    const seedKey = await generateKey(seedPhrase, salt)
    const encryptedDataKeySeed = await encryptData(rawDataKeyStr, seedKey)

    const emergencyKey = bufferToBase64(crypto.getRandomValues(new Uint8Array(32)))
    const emgKeyDerived = await generateKey(emergencyKey, salt)
    const encryptedDataKeyEmg = await encryptData(rawDataKeyStr, emgKeyDerived)

    localStorage.setItem('zkp_salt', saltB64)
    localStorage.setItem('zkp_enc_pwd', encryptedDataKeyPwd)
    localStorage.setItem('zkp_enc_seed', encryptedDataKeySeed)
    localStorage.setItem('zkp_enc_emg', encryptedDataKeyEmg)

    setIsSetup(true)
    setIsUnlocked(true)
    setDataKey(newMasterKey)

    return { seedPhrase, emergencyKey }
  }

  const unlock = async (password: string) => {
    const saltB64 = localStorage.getItem('zkp_salt')
    const encPwd = localStorage.getItem('zkp_enc_pwd')
    if (!saltB64 || !encPwd) return false

    try {
      const salt = base64ToBuffer(saltB64)
      const pwdKey = await generateKey(password, salt)
      const rawDataKeyStr = await decryptData(encPwd, pwdKey)

      if (rawDataKeyStr) {
        const key = await importKey(rawDataKeyStr)
        setDataKey(key)
        setIsUnlocked(true)
        setIsAdminMode(false)
        return true
      }
    } catch (e) {
      console.error('Unlock failed', e)
    }
    return false
  }

  const recover = async (secret: string, newPassword: string) => {
    const saltB64 = localStorage.getItem('zkp_salt')
    const encSeed = localStorage.getItem('zkp_enc_seed')
    const encEmg = localStorage.getItem('zkp_enc_emg')
    if (!saltB64) return false

    try {
      const salt = base64ToBuffer(saltB64)
      const secretKey = await generateKey(secret, salt)

      let rawDataKeyStr = null
      if (encSeed) rawDataKeyStr = await decryptData(encSeed, secretKey)
      if (!rawDataKeyStr && encEmg) rawDataKeyStr = await decryptData(encEmg, secretKey)

      if (rawDataKeyStr) {
        const newPwdKey = await generateKey(newPassword, salt)
        const encryptedDataKeyPwd = await encryptData(rawDataKeyStr, newPwdKey)
        localStorage.setItem('zkp_enc_pwd', encryptedDataKeyPwd)

        const key = await importKey(rawDataKeyStr)
        setDataKey(key)
        setIsUnlocked(true)
        setIsAdminMode(false)
        return true
      }
    } catch (e) {
      console.error('Recovery failed', e)
    }
    return false
  }

  const lock = () => {
    setDataKey(null)
    setIsUnlocked(false)
    setIsAdminMode(false)
  }

  const toggleAdminMode = () => setIsAdminMode((p) => !p)

  const loginAsManager = () => {
    setIsAdminMode(true)
    setIsUnlocked(true)
    setDataKey(null)
  }

  const switchToClientMode = () => {
    setIsAdminMode(false)
    setIsUnlocked(false)
    setDataKey(null)
  }

  const encrypt = useCallback(
    async (text: string) => {
      if (!dataKey) return text
      return await encryptData(text, dataKey)
    },
    [dataKey],
  )

  const decrypt = useCallback(
    async (encryptedText: string) => {
      if (!dataKey || !encryptedText) return encryptedText
      const res = await decryptData(encryptedText, dataKey)
      return res || encryptedText
    },
    [dataKey],
  )

  return React.createElement(
    SecurityContext.Provider,
    {
      value: {
        isSetup,
        isUnlocked,
        isAdminMode,
        setupSecurity,
        unlock,
        recover,
        lock,
        toggleAdminMode,
        loginAsManager,
        switchToClientMode,
        encrypt,
        decrypt,
      },
    },
    children,
  )
}

export default function useSecurityStore() {
  const context = useContext(SecurityContext)
  if (!context) throw new Error('useSecurityStore must be used within SecurityProvider')
  return context
}
