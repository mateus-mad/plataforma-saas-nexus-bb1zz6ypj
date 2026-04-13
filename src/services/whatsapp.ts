import pb from '@/lib/pocketbase/client'

export const getWhatsAppConfig = async () => {
  try {
    const records = await pb.collection('whatsapp_configs').getFullList({
      filter: `user_id = '${pb.authStore.record?.id}'`,
      limit: 1,
    })
    return records[0] || null
  } catch (err) {
    return null
  }
}

export const saveWhatsAppConfig = async (data: any, existingId?: string) => {
  const payload = { ...data, user_id: pb.authStore.record?.id }
  if (existingId) {
    return pb.collection('whatsapp_configs').update(existingId, payload)
  } else {
    return pb.collection('whatsapp_configs').create(payload)
  }
}

export const sendOnboardingLink = async (relacionamentoId: string) => {
  return pb.send(`/backend/v1/send-onboarding/${relacionamentoId}`, {
    method: 'POST',
  })
}
