routerAdd('GET', '/backend/v1/onboarding/{token}', (e) => {
  const token = e.request.pathValue('token')
  try {
    const rel = $app.findFirstRecordByData('relacionamentos', 'onboarding_token', token)
    return e.json(200, {
      name: rel.getString('name'),
      email: rel.getString('email'),
      phone: rel.getString('phone'),
      document_number: rel.getString('document_number'),
    })
  } catch (_) {
    throw new NotFoundError('Token inválido ou expirado')
  }
})

routerAdd('POST', '/backend/v1/onboarding/{token}', (e) => {
  const token = e.request.pathValue('token')
  let rel
  try {
    rel = $app.findFirstRecordByData('relacionamentos', 'onboarding_token', token)
  } catch (_) {
    throw new NotFoundError('Token inválido ou expirado')
  }

  const formData = e.requestInfo().body
  let dataObj = {}
  try {
    dataObj = typeof formData.data === 'string' ? JSON.parse(formData.data) : formData.data
  } catch (err) {
    dataObj = formData
  }

  rel.set('name', dataObj.name || rel.getString('name'))
  rel.set('document_number', dataObj.document_number || rel.getString('document_number'))
  rel.set('email', dataObj.email || rel.getString('email'))
  rel.set('phone', dataObj.phone || rel.getString('phone'))

  if (dataObj.birth_date) rel.set('birth_date', dataObj.birth_date)
  if (dataObj.expiry_date) rel.set('expiry_date', dataObj.expiry_date)

  if (dataObj.data) {
    rel.set('data', dataObj.data)
  }

  const files = e.findUploadedFiles('files')
  if (files && files.length > 0) {
    for (const f of files) {
      const att = new Record($app.findCollectionByNameOrId('attachments'))
      att.set('relacionamento_id', rel.id)
      att.set('user_id', rel.getString('user_id'))
      att.set('file', f)
      $app.save(att)
    }
  }

  if (dataObj.password) {
    try {
      const usersCol = $app.findCollectionByNameOrId('users')
      const newUser = new Record(usersCol)
      newUser.set('name', rel.getString('name'))
      const cleanCpf =
        rel.getString('document_number').replace(/\D/g, '') || $security.randomString(8)
      newUser.setEmail(rel.getString('email') || `${cleanCpf}@nexus.local`)
      newUser.setPassword(dataObj.password)
      newUser.setVerified(true)
      $app.save(newUser)

      rel.set('login_user_id', newUser.id)
    } catch (err) {
      console.log('Error creating user:', err)
    }
  }

  rel.set('onboarding_token', '')
  $app.save(rel)

  return e.json(200, { success: true })
})
