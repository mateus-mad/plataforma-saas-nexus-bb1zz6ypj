migrate(
  (app) => {
    const collection = new Collection({
      name: 'time_entries',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'relacionamento_id',
          type: 'relation',
          required: false,
          collectionId: app.findCollectionByNameOrId('relacionamentos').id,
          maxSelect: 1,
        },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
        },
        { name: 'timestamp', type: 'date', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['entrada', 'pausa_inicio', 'pausa_fim', 'saida'],
          maxSelect: 1,
        },
        { name: 'metadata', type: 'json', required: false },
        { name: 'notes', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_time_entries_user_id ON time_entries (user_id)',
        'CREATE INDEX idx_time_entries_timestamp ON time_entries (timestamp)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('time_entries')
    app.delete(collection)
  },
)
