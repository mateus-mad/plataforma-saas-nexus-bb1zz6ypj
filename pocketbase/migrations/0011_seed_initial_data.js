migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'contatos@madengenharia.com.br')
    } catch (e) {
      userRecord = new Record(users)
      userRecord.setEmail('contatos@madengenharia.com.br')
      userRecord.setPassword('securepassword123')
      userRecord.setVerified(true)
      app.save(userRecord)
    }

    const confs = app.findCollectionByNameOrId('configurations')

    const seedConfs = [
      { name: 'Engenheiro Civil', type: 'cargo' },
      { name: 'Arquiteto', type: 'cargo' },
      { name: 'Mestre de Obras', type: 'cargo' },
      { name: 'Auxiliar Administrativo', type: 'cargo' },
      { name: 'Engenharia', type: 'setor' },
      { name: 'Arquitetura', type: 'setor' },
      { name: 'Obras', type: 'setor' },
      { name: 'Administrativo', type: 'setor' },
    ]

    for (const c of seedConfs) {
      try {
        const records = app.findRecordsByFilter(
          'configurations',
          `name='${c.name}' && type='${c.type}'`,
        )
        if (records.length === 0) {
          const r = new Record(confs)
          r.set('name', c.name)
          r.set('type', c.type)
          app.save(r)
        }
      } catch (e) {
        const r = new Record(confs)
        r.set('name', c.name)
        r.set('type', c.type)
        app.save(r)
      }
    }
  },
  (app) => {
    // empty down
  },
)
