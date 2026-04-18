onRecordAfterCreateSuccess((e) => {
  const relId = e.record.getString('relacionamento_id')
  const rel = $app.findRecordById('relacionamentos', relId)
  let loginUserId = rel.getString('login_user_id')

  if (!loginUserId) {
    const cpfRaw = rel.getString('document_number')
    const cpf = (cpfRaw || '').replace(/\D/g, '')

    if (cpf) {
      const email = `${cpf}@nexus.app`
      let userRecord
      try {
        userRecord = $app.findAuthRecordByEmail('users', email)
      } catch (_) {
        const usersCol = $app.findCollectionByNameOrId('users')
        userRecord = new Record(usersCol)
        userRecord.setEmail(email)
        userRecord.setUsername(cpf)
        userRecord.setPassword(cpf) // CPF is the default password
        userRecord.setVerified(true)
        userRecord.set('name', rel.getString('name'))
        $app.save(userRecord)
      }

      rel.set('login_user_id', userRecord.id)
      $app.saveNoValidate(rel)
    }
  }
  return e.next()
}, 'allocations')
