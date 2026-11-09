import type { FinancialTransaction } from '@/services/financial_transactions'
export const brl = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
export const date = (d?: string | null) => (d || '').slice(0, 10)
export const overdue = (t: FinancialTransaction, today: string) =>
  ['pending', 'overdue'].includes(t.status) && !!date(t.due_date) && date(t.due_date) < today
export function financeSummary(rows: FinancialTransaction[], today: string) {
  const a = rows.filter((t) => t.status !== 'cancelled' && Number.isFinite(Number(t.amount)))
  const sum = (f: (t: FinancialTransaction) => boolean) =>
    a.filter(f).reduce((s, t) => s + Number(t.amount), 0)
  return {
    receivable: sum((t) => t.type === 'income' && t.status !== 'paid'),
    payable: sum((t) => t.type === 'expense' && t.status !== 'paid'),
    overdueReceivable: sum((t) => t.type === 'income' && overdue(t, today)),
    overduePayable: sum((t) => t.type === 'expense' && overdue(t, today)),
    received: sum((t) => t.type === 'income' && t.status === 'paid'),
    paid: sum((t) => t.type === 'expense' && t.status === 'paid'),
  }
}
