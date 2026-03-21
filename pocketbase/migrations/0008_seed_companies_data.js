migrate(
  (app) => {
    const rels = app.findCollectionByNameOrId('relacionamentos')

    const supplier = new Record(rels)

    let userId = ''
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'contatos@madengenharia.com.br')
      userId = user.id
    } catch (e) {
      const users = app.findRecordsByFilter('_pb_users_auth_', '1=1', '', 1, 0)
      if (users.length > 0) {
        userId = users[0].id
      }
    }

    if (userId) {
      supplier.set('user_id', userId)
      supplier.set('name', 'OPEN KNOWLEDGE BRASIL')
      supplier.set('type', 'fornecedor')
      supplier.set('document_number', '19.131.243/0001-97')
      supplier.set('status', 'Ativo')
      supplier.set('data', {
        dados: {
          tipoPessoa: 'PJ',
          nomeRazao: 'OPEN KNOWLEDGE BRASIL',
          fantasia: 'REDE PELO CONHECIMENTO LIVRE',
          documento: '19.131.243/0001-97',
          segmento: 'Tecnologia e Serviços',
          ativo: true,
        },
        endereco: {
          cep: '01422000',
          logradouro: 'ALAMEDA FRANCA',
          numero: '144',
          comp: 'SALA 31',
          bairro: 'JARDIM PAULISTA',
          cidade: 'SAO PAULO',
          estado: 'SP',
        },
      })
      app.save(supplier)
    }
  },
  (app) => {
    try {
      const rels = app.findRecordsByFilter(
        'relacionamentos',
        "document_number = '19.131.243/0001-97'",
        '',
        10,
        0,
      )
      rels.forEach((r) => app.delete(r))
    } catch (e) {}
  },
)
