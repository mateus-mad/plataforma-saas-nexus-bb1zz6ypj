import { useState } from 'react'
import { db } from '@/lib/database'

export function useCompanyForm(type: 'client' | 'supplier') {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const [data, setData] = useState<any>({
    dados: {
      tipoPessoa: 'PJ',
      nomeRazao: 'DIRECAO GERAL SA',
      fantasia: 'Direção Geral',
      documento: '12.345.678/0001-90',
      segmento: 'Tecnologia e Serviços',
      logo: 'https://img.usecurling.com/i?q=company&color=blue',
      complianceStatus: 'pending',
    },
    endereco: {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      numero: '123',
      cidade: 'São Paulo',
      estado: 'SP',
    },
    contato: {
      responsavel: 'João Silva',
      email: 'contato@direcaogeral.com',
      telefone: '(11) 3333-3333',
      emailCobranca: 'financeiro@direcaogeral.com',
    },
    financeiro: {
      limiteCredito: '50.000,00',
      prazoPagamento: '30',
    },
    bancario: {
      contas: [{ id: 1, banco: 'Itaú (341)', tipo: 'Corrente', agencia: '0001', conta: '12345-6' }],
    },
    acordos: {
      lista: [{ id: 1, descricao: 'Acordo SLA Padrão 2026', desconto: '5%', prazo: '45 dias' }],
    },
    contratos: {
      lista: [],
    },
    relacionamento: {
      observacoes: '',
    },
  })

  const updateData = async (section: string, field: string | null, value: any) => {
    let newData
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

    setSaveStatus('saving')
    if (newData) await db.set('companies_data', newData)
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
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
  }
}
