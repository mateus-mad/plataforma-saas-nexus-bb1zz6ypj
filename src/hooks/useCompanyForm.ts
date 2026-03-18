import { useState } from 'react'

export function useCompanyForm(type: 'client' | 'supplier') {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<any>({
    dados: {
      tipoPessoa: 'PJ',
      nomeRazao: 'DIRECAO GERAL SA',
      fantasia: 'Direção Geral',
      documento: '12.345.678/0001-90',
      ie: '123.456.789.012',
      im: '',
      setor: 'Tecnologia e Serviços',
      dataNascimento: '',
      genero: '',
      ativo: true,
      logo: 'https://img.usecurling.com/i?q=company&color=blue',
    },
    endereco: {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      numero: '123',
      comp: 'Andar 5',
      bairro: 'Sé',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    contato: {
      responsavel: 'João Silva', // Mantido para compatibilidade com outros módulos
      cargo: 'Gerente de Contas',
      email: 'contato@direcaogeral.com',
      telefone: '(11) 3333-3333',
      pessoas: [
        {
          id: 1,
          nome: 'João Silva',
          cargo: 'Gerente Comercial',
          email: 'joao@direcaogeral.com',
          telefone: '(11) 98888-7777',
        },
        {
          id: 2,
          nome: 'Ana Costa',
          cargo: 'Analista Financeiro',
          email: 'ana.financeiro@direcaogeral.com',
          telefone: '(11) 97777-6666',
        },
      ],
      whatsapp: '11999999999',
      emailCobranca: 'financeiro@direcaogeral.com',
      website: 'https://direcaogeral.com',
    },
    financeiro: {
      limiteCredito: '50.000,00',
      prazoPagamento: '30',
      pendingLimite: null,
      pendingPrazo: null,
    },
    bancario: {
      contas: [{ banco: 'Itaú (341)', tipo: 'Corrente', agencia: '0001', conta: '12345-6' }],
      pix: [{ tipo: 'CNPJ', chave: '12.345.678/0001-90' }],
    },
    acordos: {
      desconto: '5% em toda a linha de serviços',
      negociacao: 'Pagamento 30 dias após emissão da NF',
      observacoes: 'Contrato exige renovação anual de limites de SLA de entrega.',
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
      dados: {
        ...prev.dados,
        nomeRazao: 'FORNECEDOR LOGÍSTICA S.A.',
        fantasia: 'ForneceLog Transportes',
        logo: 'https://img.usecurling.com/i?q=logistics&color=blue',
      },
      endereco: {
        ...prev.endereco,
        logradouro: 'Av Paulista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }))
    setErrors({})
  }

  return { data, updateData, progress, globalProgress, errors, validate: () => true, autofillCNPJ }
}
