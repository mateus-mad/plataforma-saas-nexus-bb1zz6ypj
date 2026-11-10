// Creates an empty administrative registry. No operator or credential is seeded.
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    const batches = app.findCollectionByNameOrId('_orbix_import_batches')
    app.save(
      new Collection({
        name: '_orbix_migration_operators',
        type: 'base',
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'user_id',
            type: 'relation',
            collectionId: users.id,
            required: true,
            maxSelect: 1,
            cascadeDelete: false,
          },
          {
            name: 'batch_id',
            type: 'relation',
            collectionId: batches.id,
            required: true,
            maxSelect: 1,
            cascadeDelete: false,
          },
          { name: 'active', type: 'bool' },
          { name: 'can_read', type: 'bool' },
          { name: 'can_upload', type: 'bool' },
      { name: 'expires_at', type: 'date', required: true },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE UNIQUE INDEX idx_orbix_operator_user_batch ON _orbix_migration_operators (user_id,batch_id)',
        ],
      }),
    )
  },
  (app) => {
    throw new Error('Administrative operator registry requires a reviewed rollback')
  },
)
