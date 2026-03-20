import pb from '@/lib/pocketbase/client'

export const getAttachments = (relId: string) =>
  pb
    .collection('attachments')
    .getFullList({ filter: `relacionamento_id = '${relId}'`, sort: '-created' })

export const createAttachment = (data: FormData) => {
  if (pb.authStore.record?.id) {
    data.append('user_id', pb.authStore.record.id)
  }
  return pb.collection('attachments').create(data)
}

export const deleteAttachment = (id: string) => pb.collection('attachments').delete(id)
