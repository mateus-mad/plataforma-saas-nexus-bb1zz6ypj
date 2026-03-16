import { useState } from 'react'
import { z } from 'zod'

const formSchema = z.object({
  pessoal: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    nacionalidade: z.string().min(1, 'Obrigatório'),
    genero: z.string().min(1, 'Obrigatório'),
    civil: z.string().min(1, 'Obrigatório'),
    escolaridade: z.string().min(1, 'Obrigatório'),
    mae: z.string().min(1, 'Obrigatório'),
    cidade: z.string().min(1, 'Obrigatório'),
    uf: z.string().min(1, 'Obrigatório'),
    nascimento: z.string().min(1, 'Obrigatório'),
    pai: z.string().optional(),
    sangue: z.string().optional(),
    foto: z.string().optional(),
  }),
  docs: z
    .object({
      cpf: z.string().min(1, 'Obrigatório'),
      pis: z.string().min(1, 'Obrigatório'),
      docType: z.string().optional(),
      docIssueDate: z.string().optional(),
      ctpsNum: z.string().optional(),
      ctpsSeries: z.string().optional(),
      ctpsUf: z.string().optional(),
      ctpsDate: z.string().optional(),
      titEleitor: z.string().optional(),
      zonaEleit: z.string().optional(),
      secaoEleit: z.string().optional(),
      certReserv: z.string().optional(),
      isDriver: z.boolean().optional(),
      cnhNum: z.string().optional(),
      cnhCat: z.string().optional(),
      cnhVal: z.string().optional(),
    })
    .superRefine((val, ctx) => {
      if (val.isDriver) {
        if (!val.cnhNum)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Obrigatório', path: ['cnhNum'] })
        if (!val.cnhCat)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Obrigatório', path: ['cnhCat'] })
        if (!val.cnhVal)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Obrigatório', path: ['cnhVal'] })
      }
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
    telPrinc: z.string().min(1, 'Obrigatório'),
    email: z.string().email('E-mail inválido').or(z.literal('')),
    emergNome: z.string().min(1, 'Obrigatório'),
    emergTel: z.string().min(1, 'Obrigatório'),
    emergRel: z.string().min(1, 'Obrigatório'),
    telSec: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
  trabalho: z.object({
    matricula: z.string().min(1, 'Obrigatório'),
    depto: z.string().min(1, 'Obrigatório'),
    cargo: z.string().min(1, 'Obrigatório'),
    admissao: z.string().min(1, 'Obrigatório'),
    tipo: z.string().min(1, 'Obrigatório'),
    jornada: z.string().min(1, 'Obrigatório'),
  }),
  salario: z.object({
    base: z.string().min(1, 'Obrigatório'),
    forma: z.string().min(1, 'Obrigatório'),
    banco: z.string().min(1, 'Obrigatório'),
    agConta: z.string().min(1, 'Obrigatório'),
    conta: z.string().min(1, 'Obrigatório'),
    pix: z.string().optional(),
  }),
  ferias: z.object({
    inicio: z.string().min(1, 'Obrigatório'),
    fim: z.string().min(1, 'Obrigatório'),
    direito: z.string().optional(),
    tirados: z.string().optional(),
    prox: z.string().optional(),
  }),
  esocial: z.object({
    matricula: z.string().min(1, 'Obrigatório'),
    categoria: z.string().min(1, 'Obrigatório'),
    cbo: z.string().min(1, 'Obrigatório'),
    sefip: z.string().optional(),
    natureza: z.string().optional(),
    admissao: z.string().optional(),
  }),
  beneficios: z.any(),
  encargos: z.any(),
})

export function useCollaboratorForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState({
    pessoal: {
      name: 'Mateus amorim dias',
      nacionalidade: 'Brasileira',
      genero: 'Masculino',
      civil: 'Casado(a)',
      escolaridade: 'Superior Completo',
      mae: 'Maria Silva',
      pai: '',
      cidade: 'São Paulo',
      uf: 'SP',
      sangue: 'A+',
      nascimento: '1993-09-20',
      foto: '',
    },
    docs: {
      docType: 'RG',
      docIssueDate: '2020-05-15',
      cpf: '044.763.243-47',
      pis: '123.45678.90-1',
      ctpsNum: '',
      ctpsSeries: '',
      ctpsUf: '',
      ctpsDate: '',
      titEleitor: '',
      zonaEleit: '',
      secaoEleit: '',
      certReserv: '',
      isDriver: false,
      cnhNum: '',
      cnhCat: '',
      cnhVal: '',
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
      telPrinc: '(11) 99999-9999',
      telSec: '',
      whatsapp: '',
      email: 'mateus@exemplo.com',
      emergNome: 'Maria Silva',
      emergTel: '(11) 98888-8888',
      emergRel: 'Mãe',
    },
    trabalho: {
      matricula: 'COL0001',
      depto: 'engenharia',
      cargo: 'Engenheiro Civil',
      admissao: '2026-02-07',
      tipo: 'Mensalista',
      jornada: '44h',
    },
    salario: {
      base: '3500.00',
      forma: 'Mensal',
      banco: '341',
      agConta: '0001',
      conta: '12345-6',
      pix: '',
    },
    beneficios: { saude: '', odonto: '', vr: '', va: '', vt: '' },
    encargos: { inss: '318.82', irrf: '95.74', fgts: '280.00', depIr: '0', depSf: '0' },
    ferias: { inicio: '2026-02-07', fim: '2027-02-06', direito: '30', tirados: '0', prox: '' },
    esocial: { matricula: '', categoria: '', cbo: '', sefip: '', natureza: '', admissao: '' },
  })

  const updateData = (section: keyof typeof data, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
    if (errors[`${section}.${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${section}.${field}`]
      setErrors(newErrors)
    }
  }

  const validate = () => {
    try {
      formSchema.parse(data)
      setErrors({})
      return true
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrs: Record<string, string> = {}
        e.issues.forEach((i) => {
          newErrs[i.path.join('.')] = i.message
        })
        setErrors(newErrs)
      }
      return false
    }
  }

  const getProgress = (section: keyof typeof data) => {
    const fields = Object.values(data[section])
    if (!fields.length) return 0
    const filled = fields.filter((v) => {
      if (typeof v === 'boolean') return true
      return String(v).trim() !== ''
    }).length
    return Math.round((filled / fields.length) * 100)
  }

  const progress = {
    pessoal: getProgress('pessoal'),
    docs: getProgress('docs'),
    endereco: getProgress('endereco'),
    contato: getProgress('contato'),
    trabalho: getProgress('trabalho'),
    salario: getProgress('salario'),
    beneficios: getProgress('beneficios'),
    encargos: getProgress('encargos'),
    ferias: getProgress('ferias'),
    esocial: getProgress('esocial'),
  }

  let totalFields = 0
  let totalFilled = 0
  Object.values(data).forEach((sec) => {
    Object.values(sec).forEach((v) => {
      totalFields++
      if (typeof v === 'boolean' || String(v).trim() !== '') totalFilled++
    })
  })
  const globalProgress = Math.round((totalFilled / totalFields) * 100)

  return { data, updateData, progress, globalProgress, errors, validate }
}
