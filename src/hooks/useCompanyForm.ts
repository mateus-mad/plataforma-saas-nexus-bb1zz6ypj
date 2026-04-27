import { useState, useEffect, useRef } from 'react'
import { getEntity, createEntity, updateEntity } from '@/services/entities'
import { processDocumentOCR } from '@/services/ocr'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import pb from '@/lib/pocketbase/client'

const DEFAULT_COMPANY_DATA = {
  dados: {
    tipoPessoa: 'PJ',
    nomeRazao: '',
    fantasia: '',
    documento: '',
    segmento: '',
    logo: '',
    complianceStatus: 'pending',
  },
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    cidade: '',
    estado: '',
    bairro: '',
    comp: '',
  },
  contato: {
    responsavel: '',
    email: '',
    telefone: '',
    emailCobranca: '',
    pessoas: [],
  },
  financeiro: {
    limiteCredito: '',
    prazoPagamento: '',
  },
  bancario: {
    contas: [],
    pix: [],
  },
  acordos: {
    lista: [],
  },
  contratos: {
    lista: [],
  },
  relacionamento: {
    observacoes: '',
  },
  extraction_metadata: { auto_filled: [] as string[], manually_verified: [] as string[] },
}

const FIELD_MAPPING: Record<string, string> = {
  'dados.nomeRazao': 'name',
  'dados.fantasia': 'fantasia',
  'dados.documento': 'document_number',
  'dados.dataNascimento': 'birth_date',
}

export function useCompanyForm(type: 'client' | 'supplier', entityId?: string | null) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [isReviewingOCR, setIsReviewingOCR] = useState(false)
  const [ocrDraft, setOcrDraft] = useState<any>(null)
  const [ocrFile, setOcrFile] = useState<File | null>(null)

  const [data, setData] = useState<any>({
    ...DEFAULT_COMPANY_DATA,
    dados: { ...DEFAULT_COMPANY_DATA.dados, tipoPessoa: type === 'client' ? 'PJ' : 'PJ' },
  })

  const dataRef = useRef(data)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    if (entityId) {
      loadEntity(entityId)
    } else {
      const initialData = {
        ...DEFAULT_COMPANY_DATA,
        dados: { ...DEFAULT_COMPANY_DATA.dados, tipoPessoa: type === 'client' ? 'PJ' : 'PJ' },
      }
      dataRef.current = initialData
      setData(initialData)
    }
    setHasUnsavedChanges(false)
  }, [entityId, type])

  const loadEntity = async (id: string) => {
    try {
      const record = await getEntity(id)
      const parsedData = record.data || { ...DEFAULT_COMPANY_DATA }
      if (record.photo) {
        parsedData.dados = parsedData.dados || {}
        parsedData.dados.logo = pb.files.getURL(record, record.photo)
      }
      parsedData.extraction_metadata = record.extraction_metadata || {
        auto_filled: [],
        manually_verified: [],
      }
      dataRef.current = parsedData
      setData(parsedData)
    } catch (e) {
      console.error(e)
    }
  }

  const updateData = async (section: string, field: string | null, value: any) => {
    setHasUnsavedChanges(true)

    const currentData = dataRef.current || DEFAULT_COMPANY_DATA
    const sectionData = currentData[section] || {}

    let newData: any
    if (field === null) {
      newData = { ...currentData, [section]: value }
    } else {
      newData = {
        ...currentData,
        [section]: { ...sectionData, [field]: value },
      }
    }

    const globalField = FIELD_MAPPING[`${section}.${field}`]
    const autoFilled = newData.extraction_metadata?.auto_filled || []

    if (autoFilled.includes(globalField) || autoFilled.includes(field as string)) {
      newData.extraction_metadata.auto_filled = autoFilled.filter(
        (f: string) => f !== globalField && f !== field,
      )
      if (!newData.extraction_metadata.manually_verified)
        newData.extraction_metadata.manually_verified = []
      if (globalField && !newData.extraction_metadata.manually_verified.includes(globalField)) {
        newData.extraction_metadata.manually_verified.push(globalField)
      }
    }

    dataRef.current = newData
    setData(newData)

    if (field && errors[`${section}.${field}`]) {
      const newE = { ...errors }
      delete newE[`${section}.${field}`]
      setErrors(newE)
    }

    if (entityId) {
      setSaveStatus('saving')
      const fd = new FormData()
      fd.append('data', JSON.stringify(newData))
      fd.append('name', newData.dados?.nomeRazao || 'Sem Nome')
      fd.append('address_json', JSON.stringify(newData.endereco || {}))
      fd.append('financial_metrics', JSON.stringify(newData.financeiro || {}))
      fd.append('extraction_metadata', JSON.stringify(newData.extraction_metadata || {}))

      try {
        await updateEntity(entityId, fd)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
        setHasUnsavedChanges(false)
      } catch (err) {
        setSaveStatus('idle')
      }
    }
  }

  const saveEntity = async () => {
    setSaveStatus('saving')
    try {
      const currentData = dataRef.current || data || DEFAULT_COMPANY_DATA
      const fd = new FormData()
      fd.append('name', currentData.dados?.nomeRazao || 'Sem Nome')
      fd.append('type', type === 'client' ? 'cliente' : 'fornecedor')
      fd.append('document_number', currentData.dados?.documento || '')
      fd.append('email', currentData.contato?.emailCobranca || currentData.contato?.email || '')
      fd.append('phone', currentData.contato?.telefone || '')
      fd.append('status', currentData.dados?.ativo !== false ? 'ativo' : 'inativo')
      fd.append('data', JSON.stringify(currentData))
      fd.append('address_json', JSON.stringify(currentData.endereco || {}))
      fd.append('financial_metrics', JSON.stringify(currentData.financeiro || {}))
      fd.append('extraction_metadata', JSON.stringify(currentData.extraction_metadata || {}))

      if (entityId) {
        await updateEntity(entityId, fd)
      } else {
        await createEntity(fd)
      }

      setSaveStatus('saved')
      setHasUnsavedChanges(false)
      setTimeout(() => setSaveStatus('idle'), 2000)
      return true
    } catch (err) {
      setErrors(extractFieldErrors(err))
      setSaveStatus('idle')
      return false
    }
  }

  const validateCompliance = async () => {
    setSaveStatus('saving')
    await new Promise((r) => setTimeout(r, 1500))
    await updateData('dados', 'complianceStatus', 'valid')
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  const startOCRProcess = async (file: File) => {
    setIsProcessingOCR(true)
    setHasUnsavedChanges(true)
    try {
      const result = await processDocumentOCR(file, 'CNPJ')
      setOcrDraft(result)
      setOcrFile(file)
      setIsReviewingOCR(true)
      return { success: true }
    } catch (err: any) {
      let description =
        err.message ||
        'Não foi possível ler o documento. Certifique-se de que a foto está nítida e bem iluminada.'

      let newData = { ...dataRef.current }
      if (!newData.extraction_metadata)
        newData.extraction_metadata = { auto_filled: [], manually_verified: [] }
      newData.extraction_metadata.last_error = description
      newData.extraction_metadata.last_error_time = new Date().toISOString()
      setData(newData)
      dataRef.current = newData

      return { success: false, reason: 'error', description }
    } finally {
      setIsProcessingOCR(false)
    }
  }

  const confirmOCRData = async (editedDraft: any) => {
    let newData = { ...(dataRef.current || DEFAULT_COMPANY_DATA) }

    if (!newData.extraction_metadata)
      newData.extraction_metadata = { auto_filled: [], manually_verified: [] }
    const autoFilled = new Set(newData.extraction_metadata.auto_filled || [])

    if (editedDraft.razao_social || editedDraft.name) {
      newData.dados.nomeRazao = editedDraft.razao_social || editedDraft.name
      autoFilled.add('name')
      autoFilled.add('nomeRazao')
      autoFilled.add('razao_social')
    }
    if (editedDraft.nome_fantasia) {
      newData.dados.fantasia = editedDraft.nome_fantasia
      autoFilled.add('fantasia')
      autoFilled.add('nome_fantasia')
    }
    if (editedDraft.document_number) {
      newData.dados.documento = editedDraft.document_number
      autoFilled.add('document_number')
      autoFilled.add('documento')
    }
    if (editedDraft.cnae) {
      newData.dados.segmento = editedDraft.cnae
      autoFilled.add('cnae')
      autoFilled.add('segmento')
    }
    if (editedDraft.phone) {
      newData.contato.telefone = editedDraft.phone
      autoFilled.add('telefone')
      autoFilled.add('phone')
    }
    if (editedDraft.email) {
      newData.contato.email = editedDraft.email
      newData.contato.emailCobranca = editedDraft.email
      autoFilled.add('email')
      autoFilled.add('emailCobranca')
    }

    if (editedDraft.address) {
      const addr = editedDraft.address
      newData.endereco = {
        ...newData.endereco,
        cep: addr.cep || newData.endereco.cep,
        logradouro: addr.logradouro || newData.endereco.logradouro,
        numero: addr.numero || newData.endereco.numero,
        bairro: addr.bairro || newData.endereco.bairro,
        cidade: addr.cidade || newData.endereco.cidade,
        estado: addr.estado || newData.endereco.estado,
      }
      if (addr.cep) autoFilled.add('cep')
      if (addr.logradouro) autoFilled.add('logradouro')
      if (addr.numero) autoFilled.add('numero')
      if (addr.bairro) autoFilled.add('bairro')
      if (addr.cidade) autoFilled.add('cidade')
      if (addr.estado) autoFilled.add('estado')
    }

    newData.extraction_metadata.auto_filled = Array.from(autoFilled)
    newData.extraction_metadata.confidence = editedDraft.confidence

    setData(newData)
    dataRef.current = newData
    setIsReviewingOCR(false)
    setOcrDraft(null)
    setOcrFile(null)
    setHasUnsavedChanges(true)
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
    bancario: data.bancario?.contas?.length > 0 ? 100 : 0,
    acordos: getProgress('acordos'),
  }

  const totalSections = Object.keys(progress).length
  const globalProgress = Math.round(
    Object.values(progress).reduce((a, b) => a + b, 0) / totalSections,
  )

  return {
    data,
    updateData,
    progress,
    globalProgress,
    errors,
    validate: () => true,
    saveStatus,
    validateCompliance,
    saveEntity,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    startOCRProcess,
    isProcessingOCR,
    isReviewingOCR,
    setIsReviewingOCR,
    ocrDraft,
    ocrFile,
    confirmOCRData,
  }
}
