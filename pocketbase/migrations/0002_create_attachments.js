migrate(
  (app) => {
    const entities = app.findCollectionByNameOrId('entities')
    const collection = new Collection({
      name: 'attachments',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'entity_id',
          type: 'relation',
          collectionId: entities.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'file', type: 'file', maxSelect: 1, maxSize: 15242880 },
        { name: 'file_type', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('attachments'))
  },
)
