import { useState, useEffect } from 'react'
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
}

export function useCompanyForm(type: 'client' | 'supplier', entityId?: string | null) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [data, setData] = useState<any>({
    ...DEFAULT_COMPANY_DATA,
    dados: { ...DEFAULT_COMPANY_DATA.dados, tipoPessoa: type === 'client' ? 'PJ' : 'PJ' },
  })

  useEffect(() => {
    if (entityId) {
      loadEntity(entityId)
    } else {
      setData({
        ...DEFAULT_COMPANY_DATA,
        dados: { ...DEFAULT_COMPANY_DATA.dados, tipoPessoa: type === 'client' ? 'PJ' : 'PJ' },
      })
    }
    setHasUnsavedChanges(false)
  }, [entityId, type])

  const loadEntity = async (id: string) => {
    try {
      const record = await getEntity(id)
      const parsedData = record.data || { ...DEFAULT_COMPANY_DATA }
      if (record.photo) {
        parsedData.dados.logo = pb.files.getURL(record, record.photo)
      }
      setData(parsedData)
    } catch (e) {
      console.error(e)
    }
  }

  const updateData = async (section: string, field: string | null, value: any) => {
    setHasUnsavedChanges(true)
    let newData: any
    setData((prev: any) => {
      if (field === null) {
        newData = { ...prev, [section]: value }
      } else {
        newData = {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        }
      }
      return newData
    })

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
      fd.append('address_json', JSON.stringify(newData.endereco))
      fd.append('financial_metrics', JSON.stringify(newData.financeiro))

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
      const fd = new FormData()
      fd.append('name', data.dados?.nomeRazao || 'Sem Nome')
      fd.append('type', type === 'client' ? 'cliente' : 'fornecedor')
      fd.append('document_number', data.dados?.documento || '')
      fd.append('email', data.contato?.emailCobranca || data.contato?.email || '')
      fd.append('phone', data.contato?.telefone || '')
      fd.append('status', data.dados?.ativo !== false ? 'ativo' : 'inativo')
      fd.append('data', JSON.stringify(data))
      fd.append('address_json', JSON.stringify(data.endereco))
      fd.append('financial_metrics', JSON.stringify(data.financeiro))

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
