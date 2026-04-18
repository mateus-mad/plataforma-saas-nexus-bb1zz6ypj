migrate(
  (app) => {
    // 1. Add login_user_id to relacionamentos
    const rels = app.findCollectionByNameOrId('relacionamentos')
    if (!rels.fields.getByName('login_user_id')) {
      rels.fields.add(
        new RelationField({ name: 'login_user_id', collectionId: '_pb_users_auth_', maxSelect: 1 }),
      )
    }
    app.save(rels)

    // 2. Add cost_center to work_sites
    const workSites = app.findCollectionByNameOrId('work_sites')
    if (!workSites.fields.getByName('cost_center')) {
      workSites.fields.add(new TextField({ name: 'cost_center' }))
    }
    app.save(workSites)

    // 3. Create allocations collection
    const allocations = new Collection({
      name: 'allocations',
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
          collectionId: rels.id,
          maxSelect: 1,
        },
        {
          name: 'work_site_id',
          type: 'relation',
          required: true,
          collectionId: workSites.id,
          maxSelect: 1,
        },
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date' },
        { name: 'status', type: 'select', required: true, values: ['ativo', 'inativo'] },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_allocations_relacionamento ON allocations (relacionamento_id)',
        'CREATE INDEX idx_allocations_work_site ON allocations (work_site_id)',
      ],
    })
    app.save(allocations)

    // 4. Add indexes to time_entries for optimized cost reporting
    const timeEntries = app.findCollectionByNameOrId('time_entries')
    timeEntries.addIndex('idx_time_entries_work_site', false, 'work_site_id', '')
    timeEntries.addIndex('idx_time_entries_relacionamento', false, 'relacionamento_id', '')
    app.save(timeEntries)
  },
  (app) => {
    const allocations = app.findCollectionByNameOrId('allocations')
    app.delete(allocations)

    const workSites = app.findCollectionByNameOrId('work_sites')
    workSites.fields.removeByName('cost_center')
    app.save(workSites)

    const rels = app.findCollectionByNameOrId('relacionamentos')
    rels.fields.removeByName('login_user_id')
    app.save(rels)

    const timeEntries = app.findCollectionByNameOrId('time_entries')
    timeEntries.removeIndex('idx_time_entries_work_site')
    timeEntries.removeIndex('idx_time_entries_relacionamento')
    app.save(timeEntries)
  },
)
