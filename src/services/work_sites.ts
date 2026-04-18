import pb from '@/lib/pocketbase/client'

export interface WorkSite {
  id: string
  name: string
  latitude: number
  longitude: number
  radius_meters: number
  qr_token: string
  cost_center?: string
  created: string
  updated: string
}

export const getWorkSites = () => {
  return pb.collection('work_sites').getFullList<WorkSite>({ sort: '-created' })
}

export const getWorkSiteByToken = async (qrToken: string) => {
  const records = await pb.collection('work_sites').getFullList<WorkSite>({
    filter: `qr_token = '${qrToken}'`,
    limit: 1,
  })
  return records[0] || null
}

export const createWorkSite = (data: Partial<WorkSite>) => {
  return pb.collection('work_sites').create<WorkSite>(data)
}

export const updateWorkSite = (id: string, data: Partial<WorkSite>) => {
  return pb.collection('work_sites').update<WorkSite>(id, data)
}

export const deleteWorkSite = (id: string) => {
  return pb.collection('work_sites').delete(id)
}
