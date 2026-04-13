routerAdd('GET', '/backend/v1/onboarding/{token}', (e) => {
  const token = e.request.pathValue('token')
  try {
    const rel = $app.findFirstRecordByData('relacionamentos', 'onboarding_token', token)
    return e.json(200, {
      id: rel.id,
      name: rel.get('name'),
      type: rel.get('type'),
      document_number: rel.get('document_number'),
      email: rel.get('email'),
      phone: rel.get('phone'),
    })
  } catch (_) {
    throw new NotFoundError('Link inválido ou expirado.')
  }
})

routerAdd('POST', '/backend/v1/onboarding/{token}', (e) => {
  const token = e.request.pathValue('token')
  let rel
  try {
    rel = $app.findFirstRecordByData('relacionamentos', 'onboarding_token', token)
  } catch (_) {
    throw new NotFoundError('Link inválido ou expirado.')
  }

  const formData = e.requestInfo().body
  const dataStr = formData.data

  if (dataStr) {
    try {
      const parsed = JSON.parse(dataStr)
      if (parsed.name) rel.set('name', parsed.name)
      if (parsed.document_number) rel.set('document_number', parsed.document_number)
      if (parsed.email) rel.set('email', parsed.email)
      if (parsed.phone) rel.set('phone', parsed.phone)
      if (parsed.birth_date) rel.set('birth_date', parsed.birth_date)
      if (parsed.expiry_date) rel.set('expiry_date', parsed.expiry_date)

      const currentData = rel.get('data') || {}
      rel.set('data', Object.assign(currentData, parsed.data))
    } catch (err) {
      console.log('Error parsing data', err)
    }
  }

  rel.set('onboarding_token', '')
  rel.set('status', 'Pendente')

  $app.save(rel)

  const files = e.findUploadedFiles('files') || []
  for (let file of files) {
    const att = new Record($app.findCollectionByNameOrId('attachments'))
    att.set('relacionamento_id', rel.id)
    att.set('user_id', rel.get('user_id'))
    att.set('category', 'Onboarding Externo')
    att.set('file', file)
    $app.save(att)
  }

  return e.json(200, { success: true })
})
