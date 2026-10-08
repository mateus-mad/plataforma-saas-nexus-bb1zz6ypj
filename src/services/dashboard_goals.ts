import pb from '@/lib/pocketbase/client'

export interface DashboardGoal {
  id: string
  month: string // ex: "2026-10"
  target_revenue: number
  target_hours?: number
  notes?: string
  user_id?: string
  created?: string
  updated?: string
}

export async function getDashboardGoal(month: string): Promise<DashboardGoal | null> {
  try {
    const record = await pb
      .collection('dashboard_goals')
      .getFirstListItem<DashboardGoal>(`month = '${month}'`)
    return record
  } catch {
    return null
  }
}

export async function upsertDashboardGoal(
  month: string,
  target_revenue: number,
  target_hours?: number,
  notes?: string,
): Promise<DashboardGoal> {
  try {
    const existing = await getDashboardGoal(month)
    if (existing) {
      return await pb.collection('dashboard_goals').update<DashboardGoal>(existing.id, {
        target_revenue,
        target_hours,
        notes,
      })
    }
  } catch (err) {
    console.warn('Erro ao checar meta existente:', err)
  }

  return await pb.collection('dashboard_goals').create<DashboardGoal>({
    month,
    target_revenue,
    target_hours,
    notes,
  })
}
