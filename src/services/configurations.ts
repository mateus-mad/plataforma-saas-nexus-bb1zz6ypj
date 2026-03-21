import pb from '@/lib/pocketbase/client'

export const getConfigurations = async (type?: string) => {
  let filter = ''
  if (type) {
    filter = `type = '${type}'`
  }
  return pb.collection('configurations').getFullList({ filter, sort: 'name' })
}

export const createConfiguration = (data: { name: string; type: string }) => {
  return pb.collection('configurations').create(data)
}
