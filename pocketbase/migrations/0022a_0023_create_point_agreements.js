migrate(
  (app) => {
    const collection = new Collection({
      name: 'point_agreements',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'relacionamento_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('relacionamentos').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'signed', 'cancelled'],
        },
        { name: 'agreement_text', type: 'text' },
        { name: 'signed_at', type: 'date' },
        { name: 'signature_hash', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('point_agreements')
    app.delete(collection)
  },
)
