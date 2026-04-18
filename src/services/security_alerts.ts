import pb from '@/lib/pocketbase/client'

export const createSecurityAlert = (data: {
  user_id: string
  type: string
  message: string
  metadata?: any
}) => {
  return pb.collection('security_alerts').create(data)
}
