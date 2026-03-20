migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const record = new Record(users)
    record.setEmail('contatos@madengenharia.com.br')
    record.setPassword('securepassword123')
    record.setVerified(true)
    app.save(record)

    const entities = app.findCollectionByNameOrId('entities')

    const e1 = new Record(entities)
    e1.set('name', 'Mateus amorim dias')
    e1.set('type', 'collaborator')
    e1.set('document_number', '044.763.243-47')
    e1.set('status', 'Ativo')
    e1.set('data', {
      pessoal: {
        name: 'Mateus amorim dias',
        genero: 'Masculino',
        civil: 'Casado(a)',
        escolaridade: 'Superior Completo',
        cidade: 'São Paulo',
        uf: 'SP',
        sangue: 'A+',
      },
      trabalho: { setor: 'Civil', cargo: 'Engenheiro Civil', matricula: 'COL0001' },
      docs: { docType: 'RG' },
      salario: { base: '3500.00' },
    })
    app.save(e1)

    const e2 = new Record(entities)
    e2.set('name', 'Construtora Horizonte')
    e2.set('type', 'client')
    e2.set('document_number', '12.345.678/0001-90')
    e2.set('status', 'Ativo')
    e2.set('address', 'São Paulo - SP')
    e2.set('data', {
      dados: {
        tipoPessoa: 'PJ',
        nomeRazao: 'Construtora Horizonte',
        documento: '12.345.678/0001-90',
        ativo: true,
      },
      contato: { emailCobranca: 'contato@horizonte.com', email: 'contato@horizonte.com' },
    })
    app.save(e2)
  },
  (app) => {
    try {
      const u = app.findAuthRecordByEmail('_pb_users_auth_', 'contatos@madengenharia.com.br')
      app.delete(u)
    } catch (_) {}
  },
)
