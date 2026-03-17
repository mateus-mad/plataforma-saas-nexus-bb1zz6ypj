import { useState } from 'react'
import { z } from 'zod'

export function useCompanyForm(type: 'client' | 'supplier') {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<any>({
    dados: {
      tipoPessoa: 'PJ',
      nomeRazao: 'DIRECAO GERAL',
      fantasia: '',
      documento: '12.345.678/0001-90',
      ie: '',
      im: '',
      setor: 'Serviços',
      dataNascimento: '',
      genero: '',
      ativo: true,
      logo: '',
    },
    endereco: {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      numero: '123',
      comp: '',
      bairro: 'Sé',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    contato: {
      responsavel: 'João Silva',
      cargo: 'Gerente de Contas',
      email: 'contato@direcaogeral.com',
      telefone: '(11) 3333-3333',
      whatsapp: '11999999999',
      emailCobranca: 'financeiro@direcaogeral.com',
      website: 'https://direcaogeral.com',
    },
    financeiro: {
      limiteCredito: '0,00',
      prazoPagamento: '30',
      pendingLimite: null,
      pendingPrazo: null,
    },
    bancario: {
      contas: [],
      pix: [{ tipo: 'CNPJ', chave: '12.345.678/0001-90' }],
    },
    acordos: {
      desconto: '5% em serviços',
      negociacao: 'Pagamento 30 dias',
      observacoes: '',
    },
    relacionamento: {
      clienteDesde: '',
      segmento: '',
      observacoes: '',
    },
  })

  const updateData = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
    if (errors[`${section}.${field}`]) {
      const newE = { ...errors }
      delete newE[`${section}.${field}`]
      setErrors(newE)
    }
  }

  const getProgress = (sec: string) => {
    if (!data[sec]) return 0
    const vals = Object.values(data[sec])
    if (!vals.length) return 0
    const filled = vals.filter((v) => {
      if (typeof v === 'boolean') return true
      if (Array.isArray(v)) return v.length > 0
      return String(v).trim() !== '' && v !== null
    }).length
    return Math.round((filled / vals.length) * 100)
  }

  const progress = {
    dados: getProgress('dados'),
    endereco: getProgress('endereco'),
    contato: getProgress('contato'),
    financeiro: getProgress('financeiro'),
    bancario: data.bancario?.contas?.length > 0 || data.bancario?.pix?.length > 0 ? 100 : 0,
    acordos: getProgress('acordos'),
  }

  const totalSections = Object.keys(progress).length
  const globalProgress = Math.round(
    Object.values(progress).reduce((a, b) => a + b, 0) / totalSections,
  )

  const autofillCNPJ = () => {
    setData((prev: any) => ({
      ...prev,
      dados: { ...prev.dados, nomeRazao: 'EMPRESA BUSCADA SA', fantasia: 'Empresa Buscada' },
      endereco: { ...prev.endereco, logradouro: 'Av Paulista', cidade: 'São Paulo', estado: 'SP' },
    }))
    setErrors({})
  }

  return { data, updateData, progress, globalProgress, errors, autofillCNPJ }
}
