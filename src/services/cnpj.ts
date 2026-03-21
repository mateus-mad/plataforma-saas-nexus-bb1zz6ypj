import pb from '@/lib/pocketbase/client'

export const consultarCNPJ = async (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  if (cleanCnpj.length !== 14) throw new Error('CNPJ inválido')
  return await pb.send(`/backend/v1/cnpj/${cleanCnpj}`, { method: 'GET' })
}
