import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'

export const consultarCNPJ = async (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  if (cleanCnpj.length !== 14) {
    return { error: true, message: 'CNPJ inválido' }
  }

  try {
    const data = await pb.send(`/backend/v1/cnpj/${cleanCnpj}`, { method: 'GET' })
    return { error: false, data }
  } catch (error: any) {
    let message =
      'Não foi possível conectar ao serviço de consulta de CNPJ. Por favor, tente novamente mais tarde ou preencha manualmente.'

    if (error instanceof ClientResponseError) {
      // If it's a known error from the API (like 404 Not Found), use its message.
      // For network errors (0) or backend 503s, keep our robust fallback message.
      if (error.response?.message && error.status !== 0 && error.status !== 503) {
        message = error.response.message
      }
    }

    return { error: true, message }
  }
}
