import React, { createContext, useContext, useState } from 'react'

export type PlanTier = 'Basic' | 'Professional' | 'Enterprise'

export interface TenantUser {
  id: string
  name: string
  email: string
  role: string
}

export interface Tenant {
  id: string
  name: string
  cnpj: string
  plan: PlanTier
  activeDaysThisMonth: number
  users: TenantUser[]
}

export const PLAN_DETAILS: Record<PlanTier, { price: number; maxUsers: number }> = {
  Basic: { price: 199, maxUsers: 5 },
  Professional: { price: 499, maxUsers: 20 },
  Enterprise: { price: 999, maxUsers: 9999 },
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Acme Corp',
    cnpj: '12.345.678/0001-99',
    plan: 'Professional',
    activeDaysThisMonth: 15,
    users: [
      { id: 'u1', name: 'Admin Silva', email: 'admin@acme.com', role: 'Gerente' },
      { id: 'u2', name: 'João Souza', email: 'joao@acme.com', role: 'Analista' },
    ],
  },
  {
    id: 't2',
    name: 'Global Tech',
    cnpj: '98.765.432/0001-11',
    plan: 'Basic',
    activeDaysThisMonth: 5,
    users: [{ id: 'u3', name: 'Maria Santos', email: 'maria@global.com', role: 'Gerente' }],
  },
]

type TenantStore = {
  tenants: Tenant[]
  currentTenant: Tenant | null
  switchTenant: (id: string) => void
  addUser: (tenantId: string, user: Omit<TenantUser, 'id'>) => boolean
  removeUser: (tenantId: string, userId: string) => void
}

const TenantContext = createContext<TenantStore | null>(null)

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS)
  const [currentTenantId, setCurrentTenantId] = useState<string>(MOCK_TENANTS[0].id)

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || null

  const switchTenant = (id: string) => setCurrentTenantId(id)

  const addUser = (tenantId: string, user: Omit<TenantUser, 'id'>) => {
    const tenant = tenants.find((t) => t.id === tenantId)
    if (!tenant) return false
    const max = PLAN_DETAILS[tenant.plan].maxUsers
    if (tenant.users.length >= max) return false

    const newUser = { ...user, id: Math.random().toString(36).substring(2, 9) }
    setTenants(tenants.map((t) => (t.id === tenantId ? { ...t, users: [...t.users, newUser] } : t)))
    return true
  }

  const removeUser = (tenantId: string, userId: string) => {
    setTenants(
      tenants.map((t) =>
        t.id === tenantId ? { ...t, users: t.users.filter((u) => u.id !== userId) } : t,
      ),
    )
  }

  return React.createElement(
    TenantContext.Provider,
    { value: { tenants, currentTenant, switchTenant, addUser, removeUser } },
    children,
  )
}

export default function useTenantStore() {
  const context = useContext(TenantContext)
  if (!context) throw new Error('useTenantStore must be used within TenantProvider')
  return context
}
