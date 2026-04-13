onRecordUpdate((e) => {
  const record = e.record
  const expiryDate = record.get('expiry_date')
  let compliance = record.get('compliance_status') || 'pendente'
  let metadata = record.get('validation_metadata') || {}
  if (typeof metadata === 'string') {
    try {
      metadata = JSON.parse(metadata)
    } catch (err) {
      metadata = {}
    }
  }

  if (expiryDate) {
    const exp = new Date(expiryDate)
    if (exp < new Date()) {
      compliance = 'vencido'
      metadata.expiry = 'Documento vencido (' + exp.toLocaleDateString() + ')'
    } else {
      if (compliance !== 'vencido') compliance = 'em_dia'
      metadata.expiry = 'Documento válido'
    }
  }

  const doc = record.get('document_number')
  if (doc) {
    const cleanDoc = doc.replace(/\D/g, '')
    if (cleanDoc.length === 11 || cleanDoc.length === 14) {
      metadata.document = 'Formato válido (' + (cleanDoc.length === 11 ? 'CPF' : 'CNPJ') + ')'
      if (!expiryDate && compliance !== 'vencido') compliance = 'em_dia'
    } else {
      metadata.document = 'Formato inválido'
      compliance = 'pendente'
    }
  }

  record.set('compliance_status', compliance)
  record.set('validation_metadata', metadata)
  e.next()
}, 'relacionamentos')
