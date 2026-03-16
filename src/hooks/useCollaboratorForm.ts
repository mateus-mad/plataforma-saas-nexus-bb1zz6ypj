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
    },
    docs: {
      cpf: '044.763.243-47',
      rg: '',
      cnhCat: '',
      cnhExp: '',
      pis: '',
      titulo: '',
      ctps: '',
    },
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      comp: '',
      bairro: '',
      cidade: '',
      uf: '',
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
      cargo: 'Engenheiro Civil',
      depto: 'engenharia',
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

  const updateData = (section: keyof typeof data, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const getProgress = (section: keyof typeof data) => {
    const fields = Object.values(data[section])
    if (!fields.length) return 0
    const filled = fields.filter((v) => String(v).trim() !== '').length
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

  const totalFields = Object.values(data).reduce((acc, sec) => acc + Object.keys(sec).length, 0)
  const totalFilled = Object.values(data).reduce(
    (acc, sec) => acc + Object.values(sec).filter((v) => String(v).trim() !== '').length,
    0,
  )
  const globalProgress = Math.round((totalFilled / totalFields) * 100)

  return { data, updateData, progress, globalProgress }
}
