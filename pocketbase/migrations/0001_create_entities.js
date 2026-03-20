migrate(
  (app) => {
    const collection = new Collection({
      name: 'entities',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'type', type: 'select', values: ['collaborator', 'supplier', 'client'] },
        { name: 'document_number', type: 'text' },
        { name: 'birth_date', type: 'date' },
        { name: 'address', type: 'text' },
        {
          name: 'profile_image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'status', type: 'text' },
        { name: 'esocial_id', type: 'text' },
        { name: 'data', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('entities'))
  },
)
