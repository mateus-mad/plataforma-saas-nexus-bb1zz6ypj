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
  trabalho: { matricula: '', setor: '', admissao: '', cargo: '' },
  salario: { base: '', banco: '', agConta: '', conta: '' },
  beneficios: { saude: '', vt: '', vr: '' },
  encargos: { inss: '', irrf: '', fgts: '' },
  ferias: { inicio: '', fim: '', direito: '' },
  esocial: { matricula: '', categoria: '', cbo: '', natureza: '', admissao: '' },
  anexos: [],
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
            if (blob) {
              resolve(new File([blob], 'extracted_face.jpg', { type: 'image/jpeg' }))
            } else {
              resolve(null)
            }
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
      parsedData.docs = { ...DEFAULT_DATA.docs, ...parsedData.docs }

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
            console.error('Failed to create attachment', e)
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

      if (newData.docs?.expiryDate) {
        fd.append('expiry_date', newData.docs.expiryDate)
      }
      fd.append('compliance_status', newData.docs?.compliance?.status || 'pendente')

      const record = await getEntity(entityId)
      if (record.status === 'rascunho') {
        fd.append('status', 'ativo')
      }

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

      if (data.docs?.expiryDate) {
        fd.append('expiry_date', data.docs.expiryDate)
      }
      fd.append('compliance_status', data.docs?.compliance?.status || 'pendente')

      let recordId = entityId
      if (entityId) {
        const record = await getEntity(entityId)
        if (record.status === 'rascunho') {
          fd.append('status', 'ativo')
        } else {
          fd.append('status', record.status || 'ativo')
        }
      } else {
        fd.append('status', 'ativo')
      }

      const payloadData = { ...data }
      delete payloadData.anexos
      if (payloadData.pessoal) delete payloadData.pessoal.photoFile

      fd.append('data', JSON.stringify(payloadData))

      if (data.pessoal.photoFile) {
        fd.append('photo', data.pessoal.photoFile)
      }

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

  const processOCR = async (file: File, docType: string = 'RG') => {
    setIsProcessingOCR(true)
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
          console.error('Failed to create attachment during OCR', attErr)
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
          title: 'Erro de Extração (OCR)',
          description: 'Erro na extração: Formato não suportado ou arquivo corrompido.',
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
            mae: ocrResult.mae || newData.pessoal.mae,
            nacionalidade: ocrResult.nacionalidade || newData.pessoal.nacionalidade,
            cidade: ocrResult.cidadeNasc || newData.pessoal.cidade,
            uf: ocrResult.ufNasc || newData.pessoal.uf,
          }
        }

        if (ocrResult.document_number) {
          newData.docs = {
            ...newData.docs,
            cpf: ocrResult.document_number || newData.docs.cpf,
            docType: ocrResult.docType || docType || newData.docs.docType,
            docIssueDate: ocrResult.docIssueDate || newData.docs.docIssueDate,
            expiryDate: ocrResult.expiryDate || newData.docs.expiryDate,
            compliance: ocrResult.compliance || newData.docs.compliance,
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
          console.error('Error cropping face', cropErr)
        }
      }

      setData(newData)

      if (entityId) {
        try {
          const fd = new FormData()
          const pd = { ...newData }
          delete pd.anexos
          if (pd.pessoal) delete pd.pessoal.photoFile

          fd.append('data', JSON.stringify(pd))
          if (ocrResult) {
            if (ocrResult.name) fd.append('name', ocrResult.name)
            if (ocrResult.document_number) fd.append('document_number', ocrResult.document_number)
            if (ocrResult.expiryDate) fd.append('expiry_date', ocrResult.expiryDate)
            fd.append('compliance_status', ocrResult.compliance?.status || 'pendente')
          }

          if (newData.pessoal.photoFile) {
            fd.append('photo', newData.pessoal.photoFile)
          }

          await updateEntity(entityId, fd)
        } catch (updateErr) {
          console.error('Failed to update entity with OCR data', updateErr)
        }
      }

      return { success: true }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Erro de Extração (OCR)',
        description: 'Erro na extração: Formato não suportado ou arquivo corrompido.',
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
