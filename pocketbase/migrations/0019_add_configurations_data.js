migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('configurations')
    if (!col.fields.getByName('data')) {
      col.fields.add(new JSONField({ name: 'data' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('configurations')
    if (col.fields.getByName('data')) {
      col.fields.removeByName('data')
    }
    app.save(col)
  },
)
