migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    if (!col.fields.getByName('onboarding_token')) {
      col.fields.add(new TextField({ name: 'onboarding_token' }))
    }
    if (!col.fields.getByName('validation_metadata')) {
      col.fields.add(new JSONField({ name: 'validation_metadata' }))
    }
    app.save(col)

    col.addIndex(
      'idx_relacionamentos_onboarding_token',
      true,
      'onboarding_token',
      "onboarding_token != ''",
    )
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.removeIndex('idx_relacionamentos_onboarding_token')
    col.fields.removeByName('onboarding_token')
    col.fields.removeByName('validation_metadata')
    app.save(col)
  },
)
