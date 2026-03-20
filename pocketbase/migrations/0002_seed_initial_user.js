migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const record = new Record(users)
    record.setEmail('contatos@madengenharia.com.br')
    record.setPassword('securepassword123')
    record.setVerified(true)
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'contatos@madengenharia.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
