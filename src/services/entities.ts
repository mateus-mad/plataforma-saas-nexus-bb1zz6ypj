import pb from '@/lib/pocketbase/client'

export const getEntities = async (type?: string) => {
  let filter = ''
  if (type) {
    filter = `type = '${type}'`
  }
  return pb.collection('relacionamentos').getFullList({ filter, sort: '-created' })
}

export const getEntity = (id: string) => pb.collection('relacionamentos').getOne(id)

export const createEntity = (data: FormData | Record<string, any>) => {
  if (data instanceof FormData) {
    if (pb.authStore.record?.id) {
      data.append('user_id', pb.authStore.record.id)
    }
  } else {
    data.user_id = pb.authStore.record?.id
  }
  return pb.collection('relacionamentos').create(data)
}

export const updateEntity = (id: string, data: FormData | Record<string, any>) => {
  return pb.collection('relacionamentos').update(id, data)
}

export const deleteEntity = (id: string) => pb.collection('relacionamentos').delete(id)
