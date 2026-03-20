import { useState, useEffect } from 'react'
import { z } from 'zod'
import { getEntity, createEntity, updateEntity } from '@/services/entities'
import { getAttachments, createAttachment, deleteAttachment } from '@/services/attachments'
import { processDocumentOCR } from '@/services/ocr'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

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
  docs: { docType: 'RG', docIssueDate: '', cpf: '', pis: '', compliance: { status: 'pending' } },
  endereco: { cep: '', logradouro: '', numero: '', comp: '', bairro: '', cidade: '', estado: '' },
  contato: { telPrinc: '', whatsapp: '', email: '' },
  trabalho: { matricula: '', setor: '', admissao: '', cargo: '' },
  salario: { base: '', banco: '', agConta: '', conta: '' },
  beneficios: { saude: '', vt: '', vr: '' },
  encargos: { inss: '', irrf: '', fgts: '' },
  ferias: { inicio: '', fim: '', direito: '' },
  esocial: { matricula: '', categoria: '', cbo: '', natureza: '', admissao: '' },
  anexos: [],
}

export function useCollaboratorForm(entityId: string | null) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [isFetchingESocial, setIsFetchingESocial] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [data, setData] = useState<any>(DEFAULT_DATA)
  const { toast } = useToast()

  useEffect(() => {
    if (entityId) {
      loadEntity(entityId)
    } else {
      setData(DEFAULT_DATA)
    }
  }, [entityId])

  const loadEntity = async (id: string) => {
    try {
      const record = await getEntity(id)
      const parsedData = record.data || { ...DEFAULT_DATA }
      parsedData.pessoal = { ...DEFAULT_DATA.pessoal, ...parsedData.pessoal }

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
              console.error('Failed to delete attachment', e)
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
            console.error('Failed to upload attachment', e)
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

      if (section === 'pessoal' && field === 'foto' && file) {
        fd.append('photo', file)
      }

      try {
        await updateEntity(entityId, fd)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
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

  const saveEntity = async () => {
    setSaveStatus('saving')
    try {
      const fd = new FormData()
      fd.append('name', data.pessoal.name || 'Sem Nome')
      fd.append('type', 'colaborador')
      fd.append('document_number', data.docs.cpf || '')
      fd.append('email', data.contato.email || '')
      fd.append('phone', data.contato.telPrinc || '')
      fd.append('status', 'Ativo')

      const payloadData = { ...data }
      delete payloadData.anexos
      if (payloadData.pessoal) delete payloadData.pessoal.photoFile

      fd.append('data', JSON.stringify(payloadData))

      if (data.pessoal.photoFile) {
        fd.append('photo', data.pessoal.photoFile)
      }

      let recordId = entityId
      if (entityId) {
        await updateEntity(entityId, fd)
      } else {
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
      setTimeout(() => setSaveStatus('idle'), 2000)
      return true
    } catch (err) {
      const fieldErrors = extractFieldErrors(err)
      setErrors((prev) => ({ ...prev, ...fieldErrors }))
      setSaveStatus('idle')
      return false
    }
  }

  const processOCR = async (file: File) => {
    setIsProcessingOCR(true)
    try {
      const ocrResult = await processDocumentOCR(file)

      let newData = { ...data }

      if (ocrResult.name) {
        newData.pessoal = {
          ...newData.pessoal,
          name: ocrResult.name,
          nascimento: ocrResult.nascimento || newData.pessoal.nascimento,
          mae: ocrResult.mae || newData.pessoal.mae,
          nacionalidade: ocrResult.nacionalidade || newData.pessoal.nacionalidade,
          cidade: ocrResult.cidadeNasc || newData.pessoal.cidade,
          uf: ocrResult.ufNasc || newData.pessoal.uf,
        }
      }

      if (ocrResult.document_number) {
        newData.docs = {
          ...newData.docs,
          cpf: ocrResult.document_number,
          docType: ocrResult.docType || newData.docs.docType,
          docIssueDate: ocrResult.docIssueDate || newData.docs.docIssueDate,
          pis: ocrResult.pis || newData.docs.pis,
          compliance: ocrResult.compliance || newData.docs.compliance,
        }
      }

      if (ocrResult.address) {
        newData.endereco = {
          ...newData.endereco,
          ...ocrResult.address,
        }
      }

      let photoFileToSave: File | null = null
      if (ocrResult.photoUrl) {
        try {
          const res = await fetch(ocrResult.photoUrl)
          const blob = await res.blob()
          photoFileToSave = new File([blob], 'extracted_face.jpg', { type: 'image/jpeg' })
          newData.pessoal.photoFile = photoFileToSave
          newData.pessoal.foto = URL.createObjectURL(photoFileToSave)
        } catch (err) {
          console.error('Failed to simulated face extraction from OCR response', err)
        }
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      let type = 'archive'
      if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'image'
      if (ext === 'pdf') type = 'pdf'

      let newAnexo: any = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('pt-BR'),
        type,
        file,
      }

      if (entityId) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('relacionamento_id', entityId)
        fd.append('category', type)
        const created = await createAttachment(fd)
        newAnexo.id = created.id
        delete newAnexo.file
      }

      newData.anexos = [...newData.anexos, newAnexo]
      setData(newData)

      if (entityId) {
        const fd = new FormData()
        const pd = { ...newData }
        delete pd.anexos
        if (pd.pessoal) delete pd.pessoal.photoFile

        fd.append('data', JSON.stringify(pd))
        if (ocrResult.name) fd.append('name', ocrResult.name)
        if (ocrResult.document_number) fd.append('document_number', ocrResult.document_number)

        if (photoFileToSave) {
          fd.append('photo', photoFileToSave)
        }

        await updateEntity(entityId, fd)
      }

      return true
    } catch (e) {
      console.error(e)
      toast({
        variant: 'destructive',
        title: 'Falha na Extração (OCR)',
        description: 'Não foi possível extrair dados automaticamente deste arquivo.',
      })
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

      if (entityId) {
        setSaveStatus('saving')
        const fd = new FormData()
        const pd = { ...newData }
        delete pd.anexos
        if (pd.pessoal) delete pd.pessoal.photoFile

        fd.append('data', JSON.stringify(pd))
        await updateEntity(entityId, fd)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }

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
    saveEntity,
  }
}
