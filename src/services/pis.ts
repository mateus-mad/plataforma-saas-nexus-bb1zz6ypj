import pb from '@/lib/pocketbase/client'

export const consultarPIS = async (pis: string) => {
  const cleanPis = pis.replace(/\D/g, '')
  if (cleanPis.length < 10) return { error: true, message: 'PIS/PASEP inválido' }

  try {
    const response = await pb.send(`/backend/v1/pis-lookup/${cleanPis}`, { method: 'GET' })
    return { error: false, data: response }
  } catch (error: any) {
    return { error: true, message: error.response?.message || 'Erro ao consultar PIS/PASEP.' }
  }
}
