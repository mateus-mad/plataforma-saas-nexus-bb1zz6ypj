import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '@/lib/database'

type ModuleStore = {
  isReady: boolean
  contractedModules: string[]
  contractModule: (name: string) => Promise<void>
  removeModule: (name: string) => Promise<void>
  lastRoute: string
  setLastRoute: (route: string) => Promise<void>
}

const ModuleContext = createContext<ModuleStore | null>(null)

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const [contractedModules, setContractedModules] = useState<string[]>([])
  const [lastRoute, setLastRouteState] = useState('/app')

  useEffect(() => {
    const initDb = async () => {
      const modules = await db.get('contracted_modules')
      if (modules && modules.length > 0) {
        setContractedModules(modules)
      } else {
        const defaultModules = ['Relacionamento', 'Financeiro']
        setContractedModules(defaultModules)
        await db.set('contracted_modules', defaultModules)
      }

      const route = await db.get('last_route')
      if (route) setLastRouteState(route)

      setIsReady(true)
    }
    initDb()
  }, [])

  const contractModule = async (name: string) => {
    const newModules = [...new Set([...contractedModules, name])]
    setContractedModules(newModules)
    await db.set('contracted_modules', newModules)
  }

  const removeModule = async (name: string) => {
    const newModules = contractedModules.filter((m) => m !== name)
    setContractedModules(newModules)
    await db.set('contracted_modules', newModules)
  }

  const setLastRoute = async (route: string) => {
    setLastRouteState(route)
    await db.set('last_route', route)
  }

  return React.createElement(
    ModuleContext.Provider,
    {
      value: { isReady, contractedModules, contractModule, removeModule, lastRoute, setLastRoute },
    },
    children,
  )
}

export default function useModuleStore() {
  const context = useContext(ModuleContext)
  if (!context) throw new Error('useModuleStore must be used within ModuleProvider')
  return context
}
