import pb from '@/lib/pocketbase/client'

// Fallback local caso a collection app_settings não esteja presente no PocketBase
const LOCAL_SETTINGS_PREFIX = 'nexus_app_setting_'

export const getSetting = async (key: string) => {
  try {
    const records = await pb.collection('app_settings').getFullList({ filter: `key="${key}"` })
    return records.length > 0 ? records[0] : null
  } catch (error) {
    try {
      const item = localStorage.getItem(`${LOCAL_SETTINGS_PREFIX}${key}`)
      return item ? { id: `local-${key}`, key, value: JSON.parse(item) } : null
    } catch {
      return null
    }
  }
}

export const saveSetting = async (key: string, value: any) => {
  try {
    const existing = await getSetting(key)
    if (existing && !String(existing.id).startsWith('local-')) {
      return await pb.collection('app_settings').update(existing.id, { value })
    } else {
      return await pb.collection('app_settings').create({ key, value })
    }
  } catch (error) {
    try {
      localStorage.setItem(`${LOCAL_SETTINGS_PREFIX}${key}`, JSON.stringify(value))
      return { id: `local-${key}`, key, value }
    } catch {
      return null
    }
  }
}
