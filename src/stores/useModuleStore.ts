import React, { createContext, useContext, useState, useEffect } from 'react'
import { db } from '@/lib/database'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'

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

  const loadModulesFromPb = async () => {
    if (!pb.authStore.isValid) return null
    try {
      const record = await pb
        .collection('configurations')
        .getFirstListItem('name="contracted_modules"')
      if (record.data && Array.isArray(record.data.modules)) {
        return record.data.modules
      }
    } catch (e) {
      try {
        const defaultModules = ['Contatos', 'Financeiro', 'Controle de Ponto']
        await pb.collection('configurations').create({
          name: 'contracted_modules',
          type: 'jornada', // Required by schema
          data: { modules: defaultModules },
        })
        return defaultModules
      } catch (createErr) {
        console.error('Failed to create contracted_modules in PB', createErr)
      }
    }
    return null
  }

  useEffect(() => {
    const initDb = async () => {
      const route = await db.get('last_route')
      if (route) setLastRouteState(route)

      let modules = await loadModulesFromPb()

      if (!modules) {
        // Fallback to local DB
        const localModules = await db.get('contracted_modules')
        if (localModules && Array.isArray(localModules) && localModules.length > 0) {
          modules = localModules
        } else {
          modules = ['Contatos', 'Financeiro', 'Controle de Ponto']
        }
      }

      const migrated = modules.map((m: string) => (m === 'Relacionamento' ? 'Contatos' : m))
      setContractedModules(migrated)
      await db.set('contracted_modules', migrated)

      setIsReady(true)
    }
    initDb()
  }, [])

  // Real-time synchronization of module subscription status
  useRealtime(
    'configurations',
    (e) => {
      if (e.action === 'update' || e.action === 'create') {
        if (e.record.name === 'contracted_modules' && e.record.data?.modules) {
          const newModules = e.record.data.modules.map((m: string) =>
            m === 'Relacionamento' ? 'Contatos' : m,
          )
          setContractedModules(newModules)
          db.set('contracted_modules', newModules).catch(() => {})
        }
      }
    },
    isReady && pb.authStore.isValid,
  )

  const contractModule = async (name: string) => {
    const newModules = [...new Set([...contractedModules, name])]
    setContractedModules(newModules)
    await db.set('contracted_modules', newModules)

    if (pb.authStore.isValid) {
      try {
        const record = await pb
          .collection('configurations')
          .getFirstListItem('name="contracted_modules"')
        await pb.collection('configurations').update(record.id, {
          data: { modules: newModules },
        })
      } catch (e) {
        console.error('Error updating module contract in PB', e)
      }
    }
  }

  const removeModule = async (name: string) => {
    const newModules = contractedModules.filter((m) => m !== name)
    setContractedModules(newModules)
    await db.set('contracted_modules', newModules)

    if (pb.authStore.isValid) {
      try {
        const record = await pb
          .collection('configurations')
          .getFirstListItem('name="contracted_modules"')
        await pb.collection('configurations').update(record.id, {
          data: { modules: newModules },
        })
      } catch (e) {
        console.error('Error removing module contract in PB', e)
      }
    }
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
