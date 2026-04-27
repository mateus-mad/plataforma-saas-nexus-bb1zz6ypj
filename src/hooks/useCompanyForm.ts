import { useState, useEffect, useRef } from 'react'
import { getEntity, createEntity, updateEntity } from '@/services/entities'
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
    if (globalField && newData.extraction_metadata?.auto_filled?.includes(globalField)) {
      newData.extraction_metadata.auto_filled = newData.extraction_metadata.auto_filled.filter(
        (f: string) => f !== globalField,
      )
      if (!newData.extraction_metadata.manually_verified)
        newData.extraction_metadata.manually_verified = []
      if (!newData.extraction_metadata.manually_verified.includes(globalField)) {
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
  }
}
