export const consultarCEP = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) return { error: true, message: 'CEP inválido' }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await response.json()
    if (data.erro) return { error: true, message: 'CEP não encontrado' }
    return { error: false, data }
  } catch (error) {
    return { error: true, message: 'Erro ao consultar CEP' }
  }
}
