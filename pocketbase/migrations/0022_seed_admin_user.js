migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'contatos@madengenharia.com.br')
      record.setPassword('Skip@Pass')
      app.save(record)
    } catch (_) {
      const record = new Record(users)
      record.setEmail('contatos@madengenharia.com.br')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }
  },
  (app) => {},
)
