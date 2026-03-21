import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'

export const consultarCNPJ = async (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  if (cleanCnpj.length !== 14) throw new Error('CNPJ inválido')

  try {
    return await pb.send(`/backend/v1/cnpj/${cleanCnpj}`, { method: 'GET' })
  } catch (error) {
    if (error instanceof ClientResponseError) {
      // Status 0 indicates a network-level error (CORS, connection refused, offline)
      // Status >= 500 indicates an upstream service issue
      if (error.status === 0 || error.status >= 500) {
        throw new Error(
          'Não foi possível conectar ao serviço de consulta de CNPJ. Por favor, preencha os dados manualmente.',
        )
      }

      // Use the structured error message from the backend if available
      if (error.response?.message) {
        throw new Error(error.response.message)
      }
    }

    // Fallback for any other unexpected JS errors
    throw new Error(
      'Não foi possível conectar ao serviço de consulta de CNPJ. Por favor, preencha os dados manualmente.',
    )
  }
}
