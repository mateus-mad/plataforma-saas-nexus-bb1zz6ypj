import { useState } from 'react'
import { z } from 'zod'
import { db } from '@/lib/database'

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
      cpf: z.string().min(14, 'CPF Incompleto'),
      pis: z.string().min(1, 'Obrigatório'),
      docType: z.string().optional(),
      docIssueDate: z.string().optional(),
      compliance: z.any().optional(),
    })
    .passthrough(),
  endereco: z.object({
    cep: z.string().min(1, 'Obrigatório'),
    logradouro: z.string().min(1, 'Obrigatório'),
    numero: z.string().min(1, 'Obrigatório'),
    bairro: z.string().min(1, 'Obrigatório'),
    cidade: z.string().min(1, 'Obrigatório'),
    estado: z.string().min(1, 'Obrigatório'),
    comp: z.string().optional(),
  }),
  contato: z
    .object({
      telPrinc: z.string().min(1, 'Obrigatório'),
      email: z.string().email('E-mail inválido').or(z.literal('')),
    })
    .passthrough(),
  trabalho: z
    .object({
      matricula: z.string().min(1, 'Obrigatório'),
      setor: z.string().min(1, 'Obrigatório'),
      admissao: z.string().min(1, 'Obrigatório'),
      cargo: z.string().min(1, 'Obrigatório'),
    })
    .passthrough(),
  salario: z
    .object({
      base: z.string().min(1, 'Obrigatório'),
    })
    .passthrough(),
  ferias: z
    .object({
      inicio: z.string().min(1, 'Obrigatório'),
    })
    .passthrough(),
  esocial: z
    .object({
      matricula: z.string().min(1, 'Obrigatório'),
    })
    .passthrough(),
  beneficios: z.any(),
  encargos: z.any(),
  anexos: z.any(),
})

export function useCollaboratorForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [isFetchingESocial, setIsFetchingESocial] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

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
      foto: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
    },
    docs: {
      docType: 'RG',
      docIssueDate: '2020-05-15',
      cpf: '044.763.243-47',
      pis: '123.45678.90-1',
      compliance: { status: 'pending' },
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
      whatsapp: '',
      email: 'mateus@exemplo.com',
    },
    trabalho: {
      matricula: 'COL0001',
      setor: 'Civil',
      admissao: '2026-02-07',
      cargo: 'Engenheiro Civil',
    },
    salario: {
      base: '3500.00',
      banco: '341',
      agConta: '0001',
      conta: '12345-6',
    },
    beneficios: { saude: '', vt: '', vr: '' },
    encargos: { inss: '318.82', irrf: '95.74', fgts: '280.00' },
    ferias: { inicio: '2026-02-07', fim: '2027-02-06', direito: '30' },
    esocial: { matricula: '', categoria: '', cbo: '', natureza: '', admissao: '' },
    anexos: [
      { id: 1, name: 'RG_Frente_Verso.pdf', size: '2.4 MB', date: '12/10/2025', type: 'pdf' },
    ],
  })

  const updateData = async (section: keyof typeof data, field: string, value: any) => {
    let newData = { ...data }
    if (section === 'anexos') {
      newData.anexos = value
    } else {
      newData = {
        ...data,
        [section]: { ...(data[section] as any), [field]: value },
      }
    }

    setData(newData)

    if (errors[`${section}.${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${section}.${field}`]
      setErrors(newErrors)
    }

    setSaveStatus('saving')
    await db.set('collaborators_data', newData)
    setSaveStatus('saved')
    setTimeout(() => {
      setSaveStatus('idle')
    }, 2000)
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

  const processOCR = async (file: File) => {
    setIsProcessingOCR(true)
    try {
      await new Promise((r) => setTimeout(r, 2500))

      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      let type = 'archive'
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image'
      if (ext === 'pdf') type = 'pdf'

      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('pt-BR'),
        type,
      }

      const newData = {
        ...data,
        pessoal: {
          ...data.pessoal,
          name: 'João Silva Oliveira',
          nascimento: '1990-05-15',
          foto: 'https://img.usecurling.com/ppl/medium?gender=male&seed=15',
        },
        docs: {
          ...data.docs,
          cpf: '123.456.789-00',
          docType: 'RG',
          docIssueDate: '2013-08-20',
          compliance: {
            status: 'invalid',
            message:
              'Discrepância Encontrada: O RG extraído possui mais de 10 anos de emissão, exigindo renovação legal.',
          },
        },
        anexos: [...data.anexos, newFile],
      }
      setData(newData)

      setSaveStatus('saving')
      await db.set('collaborators_data', newData)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)

      return true
    } catch (e) {
      return false
    } finally {
      setIsProcessingOCR(false)
    }
  }

  const fetchESocial = async () => {
    setIsFetchingESocial(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      const esocialData = {
        ...data.esocial,
        matricula: 'ES987654321',
        categoria: '101',
        cbo: '2142-05',
        natureza: 'urbana',
        admissao: '1',
      }
      const newData = { ...data, esocial: esocialData }
      setData(newData)

      setSaveStatus('saving')
      await db.set('collaborators_data', newData)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)

      return true
    } catch (e) {
      return false
    } finally {
      setIsFetchingESocial(false)
    }
  }

  const getProgress = (section: keyof typeof data) => {
    if (section === 'anexos') return null
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
  Object.entries(data).forEach(([secName, sec]) => {
    if (secName === 'anexos') return
    Object.values(sec as Record<string, any>).forEach((v) => {
      totalFields++
      if (typeof v === 'boolean' || String(v).trim() !== '') totalFilled++
    })
  })
  const globalProgress = Math.round((totalFilled / totalFields) * 100)

  return {
    data,
    updateData,
    progress,
    globalProgress,
    errors,
    validate,
    processOCR,
    isProcessingOCR,
    fetchESocial,
    isFetchingESocial,
    saveStatus,
  }
}
