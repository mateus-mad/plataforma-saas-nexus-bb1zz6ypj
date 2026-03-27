migrate(
  (app) => {
    const auditLogs = new Collection({
      name: 'audit_logs',
      type: 'base',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: null,
      updateRule: null,
      deleteRule: null,
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
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'action', type: 'text', required: true },
        { name: 'module', type: 'text' },
        { name: 'field_name', type: 'text' },
        { name: 'old_value', type: 'json' },
        { name: 'new_value', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX `idx_audit_logs_relacionamento` ON `audit_logs` (`relacionamento_id`)',
        'CREATE INDEX `idx_audit_logs_created` ON `audit_logs` (`created`)',
      ],
    })
    app.save(auditLogs)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('audit_logs')
    app.delete(col)
  },
)
