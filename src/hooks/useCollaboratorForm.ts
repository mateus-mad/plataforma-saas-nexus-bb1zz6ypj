import { useState } from 'react'

export function useCollaboratorForm() {
  const [data, setData] = useState({
    pessoal: {
      name: 'Mateus Amorim Dias',
      nacionalidade: 'Brasileira',
      genero: 'Masculino',
      civil: 'Casado',
      escolaridade: 'Superior Completo',
      mae: 'Maria Amorim Dias',
      pai: 'João Dias',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    docs: {
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      cnhCat: 'AB',
      cnhExp: '2026-10-15',
      pis: '123.45678.90-1',
      titulo: '1234 5678 9012',
    },
    endereco: {
      cep: '01310-100',
      logradouro: 'Av. Paulista',
      numero: '1000',
      comp: 'Apto 45',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
    },
    contato: {
      cel: '(11) 98765-4321',
      fixo: '',
      email: 'mateus@pessoal.com',
      corp: 'mateus.dias@empresa.com',
      emergNome: 'Ana Dias',
      emergTel: '(11) 91234-5678',
      emergRel: 'Esposa',
    },
    trabalho: {
      matricula: 'COL0001',
      cargo: 'Engenheiro Civil',
      depto: 'Engenharia',
      admissao: '2026-02-07',
      tipo: 'CLT',
      jornada: '44h',
    },
    salario: {
      base: '3500.00',
      forma: 'Mensal',
      banco: 'Nubank',
      agConta: '0001 / 12345-6',
      pix: 'mateus.dias@empresa.com',
    },
    beneficios: {
      saude: 'SulAmérica',
      odonto: 'OdontoPrev',
      vr: '45.00/dia',
      va: '600.00/mês',
      vt: 'Não recebe',
    },
    encargos: { inss: 'Calculado', irrf: 'Calculado', depIr: '1', depSf: '0' },
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
