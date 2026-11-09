import type PocketBase from 'pocketbase'
import type { FinancialTransaction } from '@/services/financial_transactions'

export interface FinanceCompany {
  id: string
  name: string
  active: boolean
}

// These filters improve selection, but access is enforced by migration 0025.
// No fallback to legacy collections, localStorage or demonstration balances.
export async function readFinanceCompanies(client: PocketBase): Promise<FinanceCompany[]> {
  if (!client.authStore.isValid || !client.authStore.record?.id) {
    throw new Error('Sessão inválida. Entre novamente.')
  }
  return client.collection('finance_companies').getFullList<FinanceCompany>({ sort: 'name' })
}

export async function readCompanyFinance(
  client: PocketBase,
  companyId: string,
): Promise<FinancialTransaction[]> {
  const companies = await readFinanceCompanies(client)
  if (!companies.some((company) => company.id === companyId && company.active)) {
    throw new Error('Empresa sem acesso financeiro de consulta. Solicite a revisão do vínculo.')
  }
  return client.collection('financial_transactions').getFullList<FinancialTransaction>({
    filter: client.filter('company_id = {:company}', { company: companyId }),
    sort: '-due_date',
  })
}
