// Apply only after approval of the named migration operator and scope.
// No account is activated by this migration. All data access remains batch-scoped.
migrate(
  (app) => {
    function operatorRule(batchField, upload) {
      const alias = '@collection._orbix_migration_operators'
      return (
        "@request.auth.id != '' && " +
        alias +
        '.user_id ?= @request.auth.id && ' +
        alias +
        '.batch_id ?= ' +
        batchField +
        ' && ' +
        alias +
        '.active ?= true && ' +
      alias +
      '.expires_at ?> @now && ' +
        alias +
        '.can_read ?= true' +
        (upload ? ' && ' + alias + '.can_upload ?= true' : '')
      )
    }
    const batches = app.findCollectionByNameOrId('_orbix_import_batches')
    batches.listRule = operatorRule('id', false)
    batches.viewRule = batches.listRule
    // The request hook rejects all scalar changes and archive replacement.
    // Register and verify the hook before activating any operator.
    batches.updateRule = operatorRule('id', true)
    batches.createRule = null
    batches.deleteRule = null
    for (const name of ['database_export', 'storage_export']) {
      const field = batches.fields.getByName(name)
      field.protected = true
      field.maxSelect = 1
      field.maxSize = 52428800
      field.mimeTypes = ['application/zip']
    }
    app.save(batches)
    for (const name of ['_orbix_source_records', '_orbix_source_files']) {
      const col = app.findCollectionByNameOrId(name)
      col.listRule = operatorRule('batch_id', false)
      col.viewRule = col.listRule
      col.createRule =
        operatorRule('batch_id', true) + ' && source_project = batch_id.source_project'
      col.updateRule = null
      col.deleteRule = null
      app.save(col)
    }
  },
  (app) => {
    throw new Error('Preserve staged data and explicitly revoke operators instead of rolling back')
  },
)
