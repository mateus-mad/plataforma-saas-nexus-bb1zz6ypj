import pb from '@/lib/pocketbase/client'

export const getSetting = async (key: string) => {
  try {
    const records = await pb.collection('app_settings').getFullList({ filter: `key="${key}"` })
    return records.length > 0 ? records[0] : null
  } catch {
    return null
  }
}

export const saveSetting = async (key: string, value: any) => {
  const existing = await getSetting(key)
  if (existing) {
    return await pb.collection('app_settings').update(existing.id, { value })
  } else {
    return await pb.collection('app_settings').create({ key, value })
  }
}
