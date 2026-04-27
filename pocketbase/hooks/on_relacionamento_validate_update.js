onRecordUpdate((e) => {
  const record = e.record
  const type = record.get('type') || 'colaborador'
  let metadata = record.get('validation_metadata') || {}
  if (typeof metadata === 'string') {
    try {
      metadata = JSON.parse(metadata)
    } catch (err) {
      metadata = {}
    }
  }
  metadata.errors = []

  const expiryDate = record.get('expiry_date')
  let isExpired = false
  if (expiryDate) {
    const exp = new Date(expiryDate)
    if (exp < new Date()) {
      isExpired = true
      metadata.errors.push('Documento vencido (' + exp.toLocaleDateString('pt-BR') + ')')
    }
  }

  const doc = record.get('document_number')
  if (!doc) {
    metadata.errors.push('Documento (CPF/CNPJ) não preenchido')
  } else {
    const cleanDoc = doc.replace(/\D/g, '')
    if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
      metadata.errors.push('Formato de documento inválido')
    }
  }

  if (type === 'colaborador') {
    if (!record.get('pis_pasep')) metadata.errors.push('PIS/PASEP não preenchido')
    if (!record.get('birth_date')) metadata.errors.push('Data de nascimento não preenchida')
    if (!record.get('nationality')) metadata.errors.push('Nacionalidade não preenchida')
    if (!record.get('parents_names')) metadata.errors.push('Nome dos pais não preenchido')
  } else {
    if (!record.get('email') && !record.get('phone')) {
      metadata.errors.push('Informação de contato (Email ou Telefone) não preenchida')
    }
  }

  let compliance = 'pendente'
  if (isExpired) {
    compliance = 'vencido'
  } else if (metadata.errors.length === 0) {
    compliance = 'em_dia'
  } else {
    compliance = 'pendente'
  }

  record.set('compliance_status', compliance)
  record.set('validation_metadata', metadata)
  e.next()
}, 'relacionamentos')
