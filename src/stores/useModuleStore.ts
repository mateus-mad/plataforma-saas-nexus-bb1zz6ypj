import React, { createContext, useContext, useState, useEffect } from 'react'

type ModuleStore = {
  contractedModules: string[]
  contractModule: (name: string) => void
  removeModule: (name: string) => void
}

const ModuleContext = createContext<ModuleStore | null>(null)

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contractedModules, setContractedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_contracted_modules')
      return saved ? JSON.parse(saved) : ['Contatos', 'Financeiro']
    } catch {
      return ['Contatos', 'Financeiro']
    }
  })

  useEffect(() => {
    localStorage.setItem('nexus_contracted_modules', JSON.stringify(contractedModules))
  }, [contractedModules])

  const contractModule = (name: string) => {
    setContractedModules((prev) => [...new Set([...prev, name])])
  }

  const removeModule = (name: string) => {
    setContractedModules((prev) => prev.filter((m) => m !== name))
  }

  return React.createElement(
    ModuleContext.Provider,
    { value: { contractedModules, contractModule, removeModule } },
    children,
  )
}

export default function useModuleStore() {
  const context = useContext(ModuleContext)
  if (!context) throw new Error('useModuleStore must be used within ModuleProvider')
  return context
}
