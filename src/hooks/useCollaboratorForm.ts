import { useState } from 'react'

export function useCollaboratorForm() {
  const [data, setData] = useState({
    pessoal: {
      name: 'Mateus amorim dias',
      nacionalidade: 'Brasileira',
      genero: 'Masculino',
      civil: 'Casado(a)',
      escolaridade: 'Superior Completo',
      mae: '',
      pai: '',
      cidade: 'São Paulo',
      uf: 'SP',
      sangue: 'A+',
      nascimento: '1993-09-20',
      foto: '',
    },
    docs: {
      docType: '',
      docIssueDate: '',
      cpf: '044.763.243-47',
      pis: '',
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
      cep: '',
      logradouro: '',
      numero: '',
      comp: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
    contato: {
      telPrinc: '',
      telSec: '',
      whatsapp: '',
      email: '',
      emergNome: '',
      emergTel: '',
      emergRel: '',
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
      banco: '',
      agConta: '',
      conta: '',
      pix: '',
    },
    beneficios: {
      saude: '',
      odonto: '',
      vr: '',
      va: '',
      vt: '',
    },
    encargos: { inss: '318.82', irrf: '95.74', fgts: '280.00', depIr: '0', depSf: '0' },
    ferias: { inicio: '2026-02-07', fim: '2027-02-06', direito: '30', tirados: '0', prox: '' },
  })

  const updateData = (section: keyof typeof data, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
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

  return { data, updateData, progress, globalProgress }
}
