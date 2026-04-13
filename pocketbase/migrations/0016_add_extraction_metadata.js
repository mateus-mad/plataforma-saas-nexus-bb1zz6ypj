migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.fields.add(new JSONField({ name: 'extraction_metadata' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.fields.removeByName('extraction_metadata')
    app.save(col)
  },
)
