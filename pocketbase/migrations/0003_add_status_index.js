migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.addIndex('idx_status_rel', false, 'status', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.removeIndex('idx_status_rel')
    app.save(col)
  },
)
