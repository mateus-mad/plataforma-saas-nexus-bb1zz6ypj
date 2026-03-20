migrate(
  (app) => {
    const relCollection = new Collection({
      name: 'relacionamentos',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['colaborador', 'fornecedor', 'cliente'],
          maxSelect: 1,
        },
        { name: 'document_number', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        {
          name: 'photo',
          type: 'file',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        },
        { name: 'status', type: 'text', required: false },
        { name: 'data', type: 'json' },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(relCollection)

    const wppCollection = new Collection({
      name: 'whatsapp_configs',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        { name: 'api_key', type: 'text' },
        { name: 'instance_id', type: 'text' },
        { name: 'phone_number', type: 'text' },
        { name: 'status', type: 'text' },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(wppCollection)

    const attCollection = new Collection({
      name: 'attachments',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        { name: 'file', type: 'file', required: true, maxSelect: 1 },
        {
          name: 'relacionamento_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('relacionamentos').id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'category', type: 'text' },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(attCollection)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('attachments'))
      app.delete(app.findCollectionByNameOrId('whatsapp_configs'))
      app.delete(app.findCollectionByNameOrId('relacionamentos'))
    } catch (_) {}
  },
)
