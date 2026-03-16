import { useState } from 'react'
import { z } from 'zod'

export function useCompanyForm(type: 'client' | 'supplier') {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<any>({
    dados: {
      razao: 'Empresa Exemplo LTDA',
      fantasia: 'Exemplo',
      cnpj: '12.345.678/0001-90',
      ie: '',
      setor: 'Solar',
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
      email: 'contato@exemplo.com',
      telefone: '(11) 3333-3333',
      whatsapp: '',
    },
    ...(type === 'supplier'
      ? { bancario: { banco: '341', agConta: '0001', conta: '12345-6', pix: '' } }
      : {}),
  })

  const schema = z.object({
    dados: z.object({
      razao: z.string().min(1, 'Obrigatório'),
      fantasia: z.string().min(1, 'Obrigatório'),
      cnpj: z.string().min(1, 'Obrigatório'),
      ie: z.string().optional(),
      setor: z.string().min(1, 'Obrigatório'),
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
      email: z.string().email('E-mail inválido'),
      telefone: z.string().min(1, 'Obrigatório'),
      whatsapp: z.string().optional(),
    }),
    ...(type === 'supplier'
      ? {
          bancario: z.object({
            banco: z.string().min(1, 'Obrigatório'),
            agConta: z.string().min(1, 'Obrigatório'),
            conta: z.string().min(1, 'Obrigatório'),
            pix: z.string().optional(),
          }),
        }
      : {}),
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
    const filled = vals.filter((v) => String(v).trim() !== '').length
    return Math.round((filled / vals.length) * 100)
  }

  const progress = {
    dados: getProgress('dados'),
    endereco: getProgress('endereco'),
    contato: getProgress('contato'),
    ...(type === 'supplier' ? { bancario: getProgress('bancario') } : {}),
  }

  let totalFields = 0
  let totalFilled = 0
  Object.values(data).forEach((sec: any) => {
    Object.values(sec).forEach((v) => {
      totalFields++
      if (String(v).trim() !== '') totalFilled++
    })
  })
  const globalProgress = Math.round((totalFilled / totalFields) * 100)

  return { data, updateData, progress, globalProgress, errors, validate }
}
