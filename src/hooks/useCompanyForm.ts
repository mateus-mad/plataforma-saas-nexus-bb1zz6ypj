import { useState } from 'react'
import { z } from 'zod'

export function useCompanyForm(type: 'client' | 'supplier') {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<any>({
    dados: {
      tipoPessoa: 'PJ',
      nomeRazao: 'Empresa Exemplo LTDA',
      fantasia: 'Exemplo',
      documento: '12.345.678/0001-90',
      ie: '',
      im: '',
      setor: 'Solar',
      dataNascimento: '',
      genero: '',
      ativo: true,
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
      responsavel: 'João Gestor',
      cargo: 'Diretor',
      email: 'contato@exemplo.com',
      telefone: '(11) 3333-3333',
      whatsapp: '11999999999',
      emailCobranca: 'cobranca@exemplo.com',
      website: 'https://exemplo.com',
    },
    financeiro: {
      limiteCredito: '0,00',
      prazoPagamento: '30',
      pendingLimite: null,
      pendingPrazo: null,
      ...(type === 'supplier' ? { banco: '341', agConta: '0001', conta: '12345-6', pix: '' } : {}),
    },
    relacionamento: {
      clienteDesde: '',
      segmento: '',
      observacoes: '',
    },
  })

  let financeiroSchema: any = {
    limiteCredito: z.string().optional(),
    prazoPagamento: z.string().optional(),
    pendingLimite: z.string().nullable().optional(),
    pendingPrazo: z.string().nullable().optional(),
  }

  if (type === 'supplier') {
    financeiroSchema = {
      ...financeiroSchema,
      banco: z.string().min(1, 'Obrigatório'),
      agConta: z.string().min(1, 'Obrigatório'),
      conta: z.string().min(1, 'Obrigatório'),
      pix: z.string().optional(),
    }
  }

  const schema = z.object({
    dados: z.object({
      tipoPessoa: z.enum(['PF', 'PJ']),
      nomeRazao: z.string().min(1, 'Obrigatório'),
      fantasia: z.string().optional(),
      documento: z.string().min(1, 'Obrigatório'),
      ie: z.string().optional(),
      im: z.string().optional(),
      setor: z.string().min(1, 'Obrigatório'),
      dataNascimento: z.string().optional(),
      genero: z.string().optional(),
      ativo: z.boolean().optional(),
    }),
    endereco: z.object({
      cep: z.string().min(1, 'Obrigatório'),
      logradouro: z.string().min(1, 'Obrigatório'),
      numero: z.string().min(1, 'Obrigatório'),
      bairro: z.string().min(1, 'Obrigatório'),
      cidade: z.string().min(1, 'Obrigatório'),
      estado: z.string().min(1, 'Obrigatório'),
      comp: z.string().optional(),
    }),
    contato: z.object({
      responsavel: z.string().min(1, 'Obrigatório'),
      cargo: z.string().min(1, 'Obrigatório'),
      email: z.string().email('E-mail inválido').or(z.literal('')),
      telefone: z.string().min(1, 'Obrigatório'),
      whatsapp: z.string().optional(),
      emailCobranca: z.string().email('E-mail inválido').min(1, 'Obrigatório'),
      website: z.string().url('URL inválida').min(1, 'Obrigatório'),
    }),
    financeiro: z.object(financeiroSchema),
    relacionamento: z.object({
      clienteDesde: z.string().optional(),
      segmento: z.string().optional(),
      observacoes: z.string().optional(),
    }),
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

  const validate = () => {
    try {
      schema.parse(data)
      setErrors({})
      return true
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errs: any = {}
        e.issues.forEach((i) => {
          errs[i.path.join('.')] = i.message
        })
        setErrors(errs)
      }
      return false
    }
  }

  const getProgress = (sec: string) => {
    if (!data[sec]) return 0
    const vals = Object.values(data[sec])
    if (!vals.length) return 0
    const filled = vals.filter((v) => {
      if (typeof v === 'boolean') return true
      return String(v).trim() !== '' && v !== null
    }).length
    return Math.round((filled / vals.length) * 100)
  }

  const progress = {
    dados: getProgress('dados'),
    endereco: getProgress('endereco'),
    contato: getProgress('contato'),
    financeiro: getProgress('financeiro'),
    relacionamento: getProgress('relacionamento'),
  }

  let totalFields = 0
  let totalFilled = 0
  Object.values(data).forEach((sec: any) => {
    Object.values(sec).forEach((v) => {
      totalFields++
      if (typeof v === 'boolean' || (String(v).trim() !== '' && v !== null)) totalFilled++
    })
  })
  const globalProgress = Math.round((totalFilled / totalFields) * 100)

  const autofillCNPJ = () => {
    setData((prev: any) => ({
      ...prev,
      dados: {
        ...prev.dados,
        nomeRazao: 'Construtora Horizonte S.A.',
        fantasia: 'Horizonte Engenharia',
        ie: '111.222.333.444',
        im: '98765432',
        dataNascimento: '2010-05-15',
      },
      endereco: {
        ...prev.endereco,
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        numero: '123',
        bairro: 'Sé',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    }))
    setErrors({})
  }

  return { data, updateData, progress, globalProgress, errors, validate, autofillCNPJ }
}
