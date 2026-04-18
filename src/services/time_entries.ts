import pb from '@/lib/pocketbase/client'

export interface TimeEntry {
  id: string
  relacionamento_id?: string
  user_id: string
  work_site_id?: string
  photo?: string
  latitude?: number
  longitude?: number
  timestamp: string
  type: 'entrada' | 'pausa_inicio' | 'pausa_fim' | 'saida'
  metadata?: any
  notes?: string
  created: string
  updated: string
  expand?: any
}

export const createTimeEntry = (data: Partial<TimeEntry> | FormData) => {
  return pb.collection('time_entries').create<TimeEntry>(data)
}

export const getTimeEntries = (filter?: string, expand?: string) => {
  return pb.collection('time_entries').getFullList<TimeEntry>({
    filter,
    sort: '-timestamp',
    expand,
  })
}
