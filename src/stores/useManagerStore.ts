import React, { createContext, useContext, useState } from 'react'

export type Ticket = {
  id: string
  title: string
  status: 'Open' | 'In Progress' | 'Resolved'
  client: string
  assignee: string
}
export type Bug = {
  id: string
  title: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'New' | 'In Progress' | 'Resolved'
  ticketId?: string
}
export type Feedback = {
  id: string
  title: string
  upvotes: number
  status: 'Planned' | 'In Development' | 'Completed' | 'New'
}
export type License = {
  id: string
  tenantId: string
  key: string
  status: 'Active' | 'Inactive'
  expiresAt: string
}
export type Payment = {
  id: string
  tenantId: string
  plan: string
  amount: number
  date: string
  status: 'Paid' | 'Overdue' | 'Pending'
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'T-101',
    title: 'Erro ao emitir NF de serviço',
    status: 'Open',
    client: 'Acme Corp',
    assignee: 'João Suporte',
  },
  {
    id: 'T-102',
    title: 'Dúvida sobre mudança de plano',
    status: 'Resolved',
    client: 'Global Tech',
    assignee: 'Maria Financeiro',
  },
]

const MOCK_BUGS: Bug[] = [
  {
    id: 'B-201',
    title: 'Crash no dashboard financeiro ao filtrar por 1 ano',
    severity: 'High',
    status: 'In Progress',
    ticketId: 'T-101',
  },
  { id: 'B-202', title: 'Botão desalinhado na tela de contatos', severity: 'Low', status: 'New' },
]

const MOCK_FEEDBACKS: Feedback[] = [
  { id: 'F-301', title: 'Integração direta com o WhatsApp', upvotes: 45, status: 'Planned' },
  { id: 'F-302', title: 'Exportação de relatórios em PDF', upvotes: 12, status: 'New' },
]

const MOCK_LICENSES: License[] = [
  { id: 'L-1', tenantId: 't1', key: 'NEXUS-ACME-9988', status: 'Active', expiresAt: '2027-12-31' },
  { id: 'L-2', tenantId: 't2', key: 'NEXUS-GLOB-1122', status: 'Active', expiresAt: '2026-10-15' },
]

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'P-1',
    tenantId: 't1',
    plan: 'Professional',
    amount: 499,
    date: '2026-03-01',
    status: 'Paid',
  },
  { id: 'P-2', tenantId: 't2', plan: 'Basic', amount: 199, date: '2026-02-01', status: 'Overdue' },
]

type ManagerStore = {
  tickets: Ticket[]
  setTickets: (t: Ticket[]) => void
  bugs: Bug[]
  setBugs: (b: Bug[]) => void
  feedbacks: Feedback[]
  setFeedbacks: (f: Feedback[]) => void
  licenses: License[]
  setLicenses: (l: License[]) => void
  payments: Payment[]
  setPayments: (p: Payment[]) => void
}

const ManagerContext = createContext<ManagerStore | null>(null)

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS)
  const [bugs, setBugs] = useState<Bug[]>(MOCK_BUGS)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACKS)
  const [licenses, setLicenses] = useState<License[]>(MOCK_LICENSES)
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS)

  return React.createElement(
    ManagerContext.Provider,
    {
      value: {
        tickets,
        setTickets,
        bugs,
        setBugs,
        feedbacks,
        setFeedbacks,
        licenses,
        setLicenses,
        payments,
        setPayments,
      },
    },
    children,
  )
}

export default function useManagerStore() {
  const ctx = useContext(ManagerContext)
  if (!ctx) throw new Error('useManagerStore must be used inside ManagerProvider')
  return ctx
}
