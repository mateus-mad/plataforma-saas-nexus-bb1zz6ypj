export const generateSalt = () => crypto.getRandomValues(new Uint8Array(16))

export const bufferToBase64 = (buffer: Uint8Array) => {
  let binary = ''
  for (let i = 0; i < buffer.byteLength; i++) binary += String.fromCharCode(buffer[i])
  return btoa(binary)
}

export const base64ToBuffer = (base64: string) => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export const generateKey = async (secret: string, salt: Uint8Array): Promise<CryptoKey> => {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export const generateDataKey = async (): Promise<CryptoKey> => {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
}

export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', key)
  return bufferToBase64(new Uint8Array(exported))
}

export const importKey = async (base64Key: string): Promise<CryptoKey> => {
  const buffer = base64ToBuffer(base64Key)
  return crypto.subtle.importKey('raw', buffer, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
}

export const encryptData = async (text: string, key: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text))
  const payload = new Uint8Array(iv.length + encrypted.byteLength)
  payload.set(iv, 0)
  payload.set(new Uint8Array(encrypted), iv.length)
  return bufferToBase64(payload)
}

export const decryptData = async (encryptedBase64: string, key: CryptoKey) => {
  try {
    if (!encryptedBase64 || !encryptedBase64.startsWith || encryptedBase64.length < 24) return null
    const payload = base64ToBuffer(encryptedBase64)
    const iv = payload.slice(0, 12)
    const data = payload.slice(12)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return new TextDecoder().decode(decrypted)
  } catch (e) {
    return null
  }
}

export const generateSeedPhrase = () => {
  const words = [
    'alpha',
    'bravo',
    'charlie',
    'delta',
    'echo',
    'foxtrot',
    'golf',
    'hotel',
    'india',
    'juliet',
    'kilo',
    'lima',
    'mike',
    'november',
    'oscar',
    'papa',
    'quebec',
    'romeo',
    'sierra',
    'tango',
    'uniform',
    'victor',
    'whiskey',
    'xray',
    'yankee',
    'zulu',
  ]
  const seed = []
  for (let i = 0; i < 12; i++) seed.push(words[Math.floor(Math.random() * words.length)])
  return seed.join(' ')
}
