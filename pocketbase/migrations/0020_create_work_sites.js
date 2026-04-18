migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    const workSites = new Collection({
      name: 'work_sites',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
        { name: 'radius_meters', type: 'number', required: true },
        { name: 'qr_token', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_work_sites_qr_token ON work_sites (qr_token)'],
    })
    app.save(workSites)

    const securityAlerts = new Collection({
      name: 'security_alerts',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'user_id', type: 'relation', required: true, collectionId: users.id, maxSelect: 1 },
        { name: 'type', type: 'text', required: true },
        { name: 'message', type: 'text', required: true },
        { name: 'metadata', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(securityAlerts)

    const timeEntries = app.findCollectionByNameOrId('time_entries')
    timeEntries.fields.add(
      new RelationField({ name: 'work_site_id', collectionId: workSites.id, maxSelect: 1 }),
    )
    timeEntries.fields.add(
      new FileField({
        name: 'photo',
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      }),
    )
    timeEntries.fields.add(new NumberField({ name: 'latitude' }))
    timeEntries.fields.add(new NumberField({ name: 'longitude' }))
    app.save(timeEntries)
  },
  (app) => {
    const timeEntries = app.findCollectionByNameOrId('time_entries')
    timeEntries.fields.removeByName('work_site_id')
    timeEntries.fields.removeByName('photo')
    timeEntries.fields.removeByName('latitude')
    timeEntries.fields.removeByName('longitude')
    app.save(timeEntries)

    const securityAlerts = app.findCollectionByNameOrId('security_alerts')
    app.delete(securityAlerts)

    const workSites = app.findCollectionByNameOrId('work_sites')
    app.delete(workSites)
  },
)
