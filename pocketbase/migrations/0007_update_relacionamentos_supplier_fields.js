migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')

    // Add index on document_number to optimize CNPJ/CPF lookups
    col.addIndex('idx_relacionamentos_doc', false, 'document_number', '')

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')

    col.removeIndex('idx_relacionamentos_doc')

    app.save(col)
  },
)
