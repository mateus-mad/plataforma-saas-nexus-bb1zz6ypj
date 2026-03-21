import { useState, useEffect } from 'react'
import { z } from 'zod'
import { getEntity, createEntity, updateEntity } from '@/services/entities'
import { getAttachments, createAttachment, deleteAttachment } from '@/services/attachments'
import { processDocumentOCR } from '@/services/ocr'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { calculateComplianceStatus } from '@/lib/utils'

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
      cpf: z.string().min(14, 'CPF Incompleto').or(z.literal('')),
      pis: z.string().min(1, 'Obrigatório').or(z.literal('')),
    })
    .passthrough(),
  endereco: z.object({
    cep: z.string().min(1, 'Obrigatório').or(z.literal('')),
    logradouro: z.string().min(1, 'Obrigatório').or(z.literal('')),
    numero: z.string().min(1, 'Obrigatório').or(z.literal('')),
    bairro: z.string().min(1, 'Obrigatório').or(z.literal('')),
    cidade: z.string().min(1, 'Obrigatório').or(z.literal('')),
    estado: z.string().min(1, 'Obrigatório').or(z.literal('')),
    comp: z.string().optional(),
  }),
  contato: z.any(),
  trabalho: z.any(),
  salario: z.any(),
  ferias: z.any(),
  esocial: z.any(),
  beneficios: z.any(),
  encargos: z.any(),
  anexos: z.any(),
})

const DEFAULT_DATA = {
  pessoal: {
    name: '',
    nacionalidade: 'Brasileira',
    genero: '',
    civil: '',
    escolaridade: '',
    mae: '',
    pai: '',
    cidade: '',
    uf: '',
    sangue: '',
    nascimento: '',
    foto: '',
    photoFile: null as File | null,
  },
  docs: {
    docType: 'RG',
    docIssueDate: '',
    expiryDate: '',
    cpf: '',
    pis: '',
    compliance: { status: 'pendente' },
  },
  endereco: { cep: '', logradouro: '', numero: '', comp: '', bairro: '', cidade: '', estado: '' },
  contato: { telPrinc: '', whatsapp: '', email: '' },
  trabalho: {
    matricula: '',
    setor: '',
    cargo: '',
    admissao: '',
    contrato: 'CLT',
    jornada: '',
    turno: 'Manhã',
    horas: '44',
    experienciaDias: '90',
    experienciaFim: '',
    exameAdmissional: '',
    sindicato: '',
  },
  salario: {
    base: '',
    tipoSalario: 'Mensalista',
    formaPagamento: 'PIX',
    banco: '',
    agConta: '',
    conta: '',
    temComissao: false,
    comissaoPercent: '',
    comissaoBase: '',
    comissaoMeta: '',
  },
  beneficios: {
    vt: false,
    va: false,
    vr: false,
    saude: false,
    odonto: false,
    combustivel: false,
    vida: false,
    creche: false,
  },
  encargos: { inss: '', irrf: '', fgts: '' },
  ferias: { inicio: '', fim: '', direito: '30 dias', proximoVencimento: '' },
  esocial: { matricula: '', categoria: '', cbo: '', natureza: '', admissao: '' },
  anexos: [],
}

function calculateEncargos(salary: number) {
  let inss = 0
  if (salary <= 1412.0) inss = salary * 0.075
  else if (salary <= 2666.68) inss = 1412 * 0.075 + (salary - 1412) * 0.09
  else if (salary <= 4000.03) inss = 1412 * 0.075 + 1254.68 * 0.09 + (salary - 2666.68) * 0.12
  else
    inss =
      1412 * 0.075 + 1254.68 * 0.09 + 1333.35 * 0.12 + (Math.min(salary, 7786.02) - 4000.03) * 0.14

  let baseIr = salary - inss
  let irrf = 0
  if (baseIr <= 2259.2) irrf = 0
  else if (baseIr <= 2826.65) irrf = baseIr * 0.075 - 169.44
  else if (baseIr <= 3751.05) irrf = baseIr * 0.15 - 381.44
  else if (baseIr <= 4664.68) irrf = baseIr * 0.225 - 662.77
  else irrf = baseIr * 0.275 - 896.0

  const fgts = salary * 0.08

  return {
    inss: inss > 0 ? `R$ ${inss.toFixed(2).replace('.', ',')}` : 'R$ 0,00',
    irrf: irrf > 0 ? `R$ ${irrf.toFixed(2).replace('.', ',')}` : 'R$ 0,00',
    fgts: `R$ ${fgts.toFixed(2).replace('.', ',')}`,
  }
}

const cropFaceFromImage = async (file: File): Promise<File | null> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = async () => {
      try {
        let rect = {
          x: img.width * 0.1,
          y: img.height * 0.2,
          w: img.width * 0.3,
          h: img.height * 0.5,
        }
        if ('FaceDetector' in window) {
          const detector = new (window as any).FaceDetector()
          const faces = await detector.detect(img)
          if (faces && faces.length > 0) {
            const box = faces[0].boundingBox
            rect = {
              x: Math.max(0, box.x - box.width * 0.2),
              y: Math.max(0, box.y - box.height * 0.2),
              w: Math.min(img.width - box.x, box.width * 1.4),
              h: Math.min(img.height - box.y, box.height * 1.4),
            }
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = rect.w
        canvas.height = rect.h
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(new File([blob], 'extracted_face.jpg', { type: 'image/jpeg' }))
            else resolve(null)
          },
          'image/jpeg',
          0.9,
        )
      } catch (e) {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export function useCollaboratorForm(entityId: string | null) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [isFetchingESocial, setIsFetchingESocial] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [data, setData] = useState<any>(DEFAULT_DATA)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (entityId) {
      loadEntity(entityId)
    } else {
      setData(DEFAULT_DATA)
    }
    setHasUnsavedChanges(false)
  }, [entityId])

  const loadEntity = async (id: string) => {
    try {
      const record = await getEntity(id)
      const parsedData = record.data || { ...DEFAULT_DATA }
      parsedData.pessoal = { ...DEFAULT_DATA.pessoal, ...parsedData.pessoal }
      parsedData.docs = { ...DEFAULT_DATA.docs, ...parsedData.docs }
      parsedData.beneficios = { ...DEFAULT_DATA.beneficios, ...parsedData.beneficios }
      parsedData.salario = { ...DEFAULT_DATA.salario, ...parsedData.salario }
      parsedData.trabalho = { ...DEFAULT_DATA.trabalho, ...parsedData.trabalho }

      if (record.photo) {
        parsedData.pessoal.foto = pb.files.getURL(record, record.photo)
      }

      const atts = await getAttachments(id)
      parsedData.anexos = atts.map((a: any) => ({
        id: a.id,
        name: a.file,
        size: '0 MB',
        date: new Date(a.created).toLocaleDateString('pt-BR'),
        type: a.category,
      }))

      setData(parsedData)
    } catch (e) {
      console.error(e)
    }
  }

  const updateData = async (section: string, field: string, value: any, file?: File) => {
    setHasUnsavedChanges(true)
    let newData = { ...data }

    if (section === 'anexos') {
      if (entityId) {
        const currentIds = data.anexos.map((a: any) => a.id)
        const newIds = value.map((a: any) => a.id)
        const deletedIds = currentIds.filter((id: any) => !newIds.includes(id))

        for (const id of deletedIds) {
          if (typeof id === 'string') {
            try {
              await deleteAttachment(id)
            } catch (e) {
              console.error(e)
            }
          }
        }

        const pendingAnexos = value.filter((a: any) => !currentIds.includes(a.id) && a.file)
        for (const anexo of pendingAnexos) {
          const fd = new FormData()
          fd.append('file', anexo.file)
          fd.append('relacionamento_id', entityId)
          fd.append('category', anexo.type)
          try {
            const created = await createAttachment(fd)
            anexo.id = created.id
            delete anexo.file
          } catch (e) {
            console.error(e)
          }
        }
      }
      newData.anexos = value
    } else {
      newData = {
        ...data,
        [section]: { ...(data[section] as any), [field]: value },
      }
      if (section === 'pessoal' && field === 'foto' && file) {
        newData.pessoal.photoFile = file
      }

      if (section === 'docs' && field === 'expiryDate') {
        const compStatus = calculateComplianceStatus(value)
        newData.docs.compliance = { ...newData.docs.compliance, status: compStatus }
      }

      if (section === 'salario' && field === 'base') {
        const sal = parseFloat(
          String(value)
            .replace(/[^\d,]/g, '')
            .replace(',', '.'),
        )
        if (!isNaN(sal)) {
          const encargos = calculateEncargos(sal)
          newData.encargos = {
            ...newData.encargos,
            inss: encargos.inss,
            irrf: encargos.irrf,
            fgts: encargos.fgts,
          }
        }
      }

      if (section === 'trabalho' && field === 'admissao' && value) {
        const adDate = new Date(value)
        if (!isNaN(adDate.getTime())) {
          newData.ferias.inicio = value
          const fimDate = new Date(adDate)
          fimDate.setFullYear(fimDate.getFullYear() + 1)
          fimDate.setDate(fimDate.getDate() - 1)
          newData.ferias.fim = fimDate.toISOString().split('T')[0]

          const prevDate = new Date(fimDate)
          prevDate.setDate(prevDate.getDate() + 1)
          const projDate = new Date(prevDate)
          projDate.setFullYear(projDate.getFullYear() + 1)
          newData.ferias.proximoVencimento = projDate.toISOString().split('T')[0]
        }
      }

      if (
        section === 'trabalho' &&
        (field === 'experienciaDias' || field === 'admissao') &&
        newData.trabalho.admissao &&
        newData.trabalho.experienciaDias
      ) {
        const adDate = new Date(newData.trabalho.admissao)
        const days = parseInt(newData.trabalho.experienciaDias, 10)
        if (!isNaN(adDate.getTime()) && !isNaN(days)) {
          const fim = new Date(adDate)
          fim.setDate(fim.getDate() + days)
          newData.trabalho.experienciaFim = fim.toISOString().split('T')[0]
        }
      }
    }

    setData(newData)

    if (errors[`${section}.${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${section}.${field}`]
      setErrors(newErrors)
    }

    if (entityId && section !== 'anexos') {
      setSaveStatus('saving')
      const payloadData = { ...newData }
      delete payloadData.anexos
      if (payloadData.pessoal) delete payloadData.pessoal.photoFile

      const fd = new FormData()
      fd.append('data', JSON.stringify(payloadData))
      fd.append('name', newData.pessoal.name || '')
      fd.append('document_number', newData.docs.cpf || '')

      if (newData.docs?.expiryDate) fd.append('expiry_date', newData.docs.expiryDate)
      fd.append('compliance_status', calculateComplianceStatus(newData.docs?.expiryDate))

      if (newData.pessoal.nacionalidade) fd.append('nationality', newData.pessoal.nacionalidade)
      if (newData.pessoal.genero)
        fd.append(
          'gender',
          newData.pessoal.genero === 'Masculino'
            ? 'masc'
            : newData.pessoal.genero === 'Feminino'
              ? 'fem'
              : 'outros',
        )
      if (newData.pessoal.mae || newData.pessoal.pai)
        fd.append('parents_names', `${newData.pessoal.mae || ''} / ${newData.pessoal.pai || ''}`)
      if (newData.pessoal.cidade) fd.append('birth_city', newData.pessoal.cidade)
      if (newData.pessoal.uf) fd.append('birth_uf', newData.pessoal.uf)
      if (newData.pessoal.nascimento)
        fd.append('birth_date', new Date(newData.pessoal.nascimento).toISOString())

      if (newData.docs.pis) fd.append('pis_pasep', newData.docs.pis)
      if (newData.docs.docIssueDate)
        fd.append('doc_emission_date', new Date(newData.docs.docIssueDate).toISOString())
      if (newData.docs.docType) fd.append('doc_type', newData.docs.docType)

      fd.append('address_json', JSON.stringify(newData.endereco))
      fd.append('work_details', JSON.stringify(newData.trabalho))
      fd.append('salary_details', JSON.stringify(newData.salario))
      fd.append('benefits_config', JSON.stringify(newData.beneficios))
      fd.append('financial_metrics', JSON.stringify(newData.encargos))

      const record = await getEntity(entityId)
      if (record.status === 'rascunho') fd.append('status', 'ativo')

      if (section === 'pessoal' && field === 'foto' && file) fd.append('photo', file)

      try {
        await updateEntity(entityId, fd)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
        setHasUnsavedChanges(false)
      } catch (e) {
        setSaveStatus('idle')
      }
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

  const saveEntityLocal = async () => {
    setSaveStatus('saving')
    try {
      const fd = new FormData()
      fd.append('name', data.pessoal.name || 'Sem Nome')
      fd.append('type', 'colaborador')
      fd.append('document_number', data.docs.cpf || '')
      fd.append('email', data.contato.email || '')
      fd.append('phone', data.contato.telPrinc || '')

      if (data.docs?.expiryDate) fd.append('expiry_date', data.docs.expiryDate)
      fd.append('compliance_status', calculateComplianceStatus(data.docs?.expiryDate))

      if (data.pessoal.nacionalidade) fd.append('nationality', data.pessoal.nacionalidade)
      if (data.pessoal.genero)
        fd.append(
          'gender',
          data.pessoal.genero === 'Masculino'
            ? 'masc'
            : data.pessoal.genero === 'Feminino'
              ? 'fem'
              : 'outros',
        )
      if (data.pessoal.mae || data.pessoal.pai)
        fd.append('parents_names', `${data.pessoal.mae || ''} / ${data.pessoal.pai || ''}`)
      if (data.pessoal.cidade) fd.append('birth_city', data.pessoal.cidade)
      if (data.pessoal.uf) fd.append('birth_uf', data.pessoal.uf)
      if (data.pessoal.nascimento)
        fd.append('birth_date', new Date(data.pessoal.nascimento).toISOString())

      if (data.docs.pis) fd.append('pis_pasep', data.docs.pis)
      if (data.docs.docIssueDate)
        fd.append('doc_emission_date', new Date(data.docs.docIssueDate).toISOString())
      if (data.docs.docType) fd.append('doc_type', data.docs.docType)

      fd.append('address_json', JSON.stringify(data.endereco))
      fd.append('work_details', JSON.stringify(data.trabalho))
      fd.append('salary_details', JSON.stringify(data.salario))
      fd.append('benefits_config', JSON.stringify(data.beneficios))
      fd.append('financial_metrics', JSON.stringify(data.encargos))

      let recordId = entityId
      if (entityId) {
        const record = await getEntity(entityId)
        fd.append('status', record.status === 'rascunho' ? 'ativo' : record.status || 'ativo')
      } else {
        fd.append('status', 'ativo')
      }

      const payloadData = { ...data }
      delete payloadData.anexos
      if (payloadData.pessoal) delete payloadData.pessoal.photoFile
      fd.append('data', JSON.stringify(payloadData))

      if (data.pessoal.photoFile) fd.append('photo', data.pessoal.photoFile)

      if (entityId) await updateEntity(entityId, fd)
      else {
        const created = await createEntity(fd)
        recordId = created.id
      }

      const pendingAnexos = data.anexos.filter((a: any) => a.file)
      for (const anexo of pendingAnexos) {
        const attFd = new FormData()
        attFd.append('file', anexo.file)
        attFd.append('relacionamento_id', recordId as string)
        attFd.append('category', anexo.type)
        const created = await createAttachment(attFd)
        anexo.id = created.id
        delete anexo.file
      }

      setSaveStatus('saved')
      setHasUnsavedChanges(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
      return true
    } catch (err) {
      setErrors((prev) => ({ ...prev, ...extractFieldErrors(err) }))
      setSaveStatus('idle')
      return false
    }
  }

  const processOCR = async (file: File, docType: string = 'RG') => {
    setIsProcessingOCR(true)
    setHasUnsavedChanges(true)
    try {
      const type = 'Documento de Identificação'
      let newAnexo: any = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('pt-BR'),
        type,
        file,
      }

      if (entityId) {
        try {
          const fd = new FormData()
          fd.append('file', file)
          fd.append('relacionamento_id', entityId)
          fd.append('category', type)
          const created = await createAttachment(fd)
          newAnexo.id = created.id
          delete newAnexo.file
        } catch (attErr) {
          console.error(attErr)
        }
      }

      let newData = { ...data }
      newData.anexos = [...newData.anexos, newAnexo]

      let ocrResult = null
      try {
        ocrResult = await processDocumentOCR(file, docType)
      } catch (err: any) {
        toast({
          variant: 'destructive',
          title: 'Erro na extração OCR',
          description: 'Não foi possível extrair dados automaticamente.',
        })
        setIsProcessingOCR(false)
        return { success: false, reason: 'error' }
      }

      if (ocrResult) {
        if (ocrResult.name) {
          newData.pessoal = {
            ...newData.pessoal,
            name: ocrResult.name || newData.pessoal.name,
            nascimento: ocrResult.nascimento || newData.pessoal.nascimento,
          }
        }
        if (ocrResult.document_number) {
          const newExpiry = ocrResult.expiryDate || newData.docs.expiryDate
          newData.docs = {
            ...newData.docs,
            cpf: ocrResult.document_number || newData.docs.cpf,
            docType: ocrResult.docType || docType || newData.docs.docType,
            docIssueDate: ocrResult.docIssueDate || newData.docs.docIssueDate,
            expiryDate: newExpiry,
            compliance: {
              ...newData.docs.compliance,
              status: calculateComplianceStatus(newExpiry),
            },
          }
        }
        if (ocrResult.address) {
          const addr = ocrResult.address
          newData.endereco = {
            ...newData.endereco,
            cep: addr.cep || newData.endereco.cep,
            logradouro: addr.logradouro || newData.endereco.logradouro,
            numero: addr.numero || newData.endereco.numero,
            bairro: addr.bairro || newData.endereco.bairro,
            cidade: addr.cidade || newData.endereco.cidade,
            estado: addr.estado || newData.endereco.estado,
          }
        }
        try {
          const faceFile = await cropFaceFromImage(file)
          if (faceFile) {
            newData.pessoal.photoFile = faceFile
            newData.pessoal.foto = URL.createObjectURL(faceFile)
          }
        } catch (cropErr) {
          console.error(cropErr)
        }
      }

      setData(newData)
      return { success: true }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na extração OCR',
        description: 'Não foi possível extrair dados.',
      })
      return { success: false, reason: 'error' }
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
      setHasUnsavedChanges(true)
      return true
    } catch (e) {
      return false
    } finally {
      setIsFetchingESocial(false)
    }
  }

  const getProgress = (section: string) => {
    if (section === 'anexos') return null
    const fields = Object.values(data[section] || {})
    const cleanFields = fields.filter((v) => !(v instanceof File))
    if (!cleanFields.length) return 0
    const filled = cleanFields.filter((v) => {
      if (typeof v === 'boolean') return true
      return String(v).trim() !== ''
    }).length
    return Math.round((filled / cleanFields.length) * 100)
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
      if (v instanceof File) return
      totalFields++
      if (typeof v === 'boolean' || String(v).trim() !== '') totalFilled++
    })
  })
  const globalProgress = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0

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
    saveEntity: saveEntityLocal,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  }
}
