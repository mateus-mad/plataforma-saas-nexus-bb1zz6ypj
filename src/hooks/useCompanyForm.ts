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
      lista: [
        {
          id: 1,
          descricao: 'Acordo SLA Padrão 2026',
          desconto: '5%',
          prazo: '45 dias',
          dataFim: '2026-12-31',
        },
      ],
    },
    contratos: {
      lista: [],
    },
    relacionamento: {
      clienteDesde: '2022-04-10',
      segmento: '',
      observacoes: '',
      problemas: [],
      elogios: [],
    },
  })

  const updateData = (section: string, field: string | null, value: any) => {
    setData((prev: any) => {
      if (field === null) {
        return { ...prev, [section]: value }
      }
      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }
    })
    if (field && errors[`${section}.${field}`]) {
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

  const autofillCNPJ = async (cnpj?: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setData((prev: any) => {
          const current = prev.dados || {}
          return {
            ...prev,
            dados: {
              ...current,
              documento: cnpj || current.documento || '12.345.678/0001-90',
              nomeRazao:
                current.nomeRazao && current.nomeRazao !== 'DIRECAO GERAL SA'
                  ? current.nomeRazao
                  : 'NEXUS LOGÍSTICA S.A.',
              fantasia:
                current.fantasia && current.fantasia !== 'Direção Geral'
                  ? current.fantasia
                  : 'NexusLog Transporte',
              logo: current.logo || 'https://img.usecurling.com/i?q=logistics&color=blue',
              segmento: current.segmento || 'Logística',
              dataNascimento: current.dataNascimento || '2015-08-20',
            },
            endereco: {
              ...prev.endereco,
              logradouro: prev.endereco?.logradouro || 'Av Paulista',
              cidade: prev.endereco?.cidade || 'São Paulo',
              estado: prev.endereco?.estado || 'SP',
            },
          }
        })
        setErrors({})
        resolve(true)
      }, 800)
    })
  }

  return { data, updateData, progress, globalProgress, errors, validate: () => true, autofillCNPJ }
}
