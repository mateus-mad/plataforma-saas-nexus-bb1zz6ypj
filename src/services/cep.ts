import pb from '@/lib/pocketbase/client'

export const consultarCEP = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) return { error: true, message: 'CEP inválido' }

  try {
    const response = await pb.send(`/backend/v1/cep-lookup/${cleanCep}`, { method: 'GET' })
    return { error: false, data: response }
  } catch (error: any) {
    return {
      error: true,
      message:
        error.response?.message ||
        'Serviço de consulta de CEP temporariamente indisponível, por favor preencha manualmente.',
    }
  }
}
