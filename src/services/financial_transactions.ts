import pb from '@/lib/pocketbase/client'

export interface FinancialTransaction {
  id: string
  description: string
  type: 'income' | 'expense'
  amount: number
  category?: string
  due_date: string
  payment_date?: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  relacionamento_id?: string
  user_id?: string
  notes?: string
  created?: string
  updated?: string
  expand?: {
    relacionamento_id?: {
      id: string
      name: string
      type: string
    }
  }
}

export async function getFinancialTransactions(options?: {
  filter?: string
  sort?: string
  limit?: number
}): Promise<FinancialTransaction[]> {
  try {
    const records = await pb
      .collection('financial_transactions')
      .getFullList<FinancialTransaction>({
        filter: options?.filter,
        sort: options?.sort || '-due_date',
        expand: 'relacionamento_id',
      })
    return records
  } catch (error) {
    console.warn('Falha ao obter financial_transactions do PocketBase:', error)
    return []
  }
}

export async function createFinancialTransaction(
  data: Partial<FinancialTransaction>,
): Promise<FinancialTransaction> {
  return pb.collection('financial_transactions').create<FinancialTransaction>(data)
}

export async function updateFinancialTransaction(
  id: string,
  data: Partial<FinancialTransaction>,
): Promise<FinancialTransaction> {
  return pb.collection('financial_transactions').update<FinancialTransaction>(id, data)
}
