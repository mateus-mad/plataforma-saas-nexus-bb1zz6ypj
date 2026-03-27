migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')

    col.fields.add(new DateField({ name: 'hire_date' }))
    col.fields.add(new DateField({ name: 'termination_date' }))

    const phoneField = col.fields.getByName('phone')
    if (phoneField) {
      phoneField.pattern = '^\\+?[0-9\\(\\)\\-\\s]{8,20}$'
    }

    const docField = col.fields.getByName('document_number')
    if (docField) {
      docField.pattern =
        '^([0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}|[0-9]{2}\\.?[0-9]{3}\\.?[0-9]{3}\\/?[0-9]{4}\\-?[0-9]{2}|[0-9]{5,14})$'
    }

    col.addIndex('idx_relacionamentos_type', false, 'type', '')
    col.addIndex('idx_relacionamentos_compliance_status', false, 'compliance_status', '')
    col.addIndex('idx_unique_doc_user', true, 'document_number,user_id', "document_number != ''")
    col.addIndex('idx_unique_email_user', true, 'email,user_id', "email != ''")

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')

    col.fields.removeByName('hire_date')
    col.fields.removeByName('termination_date')

    const phoneField = col.fields.getByName('phone')
    if (phoneField) {
      phoneField.pattern = ''
    }

    const docField = col.fields.getByName('document_number')
    if (docField) {
      docField.pattern = ''
    }

    col.removeIndex('idx_relacionamentos_type')
    col.removeIndex('idx_relacionamentos_compliance_status')
    col.removeIndex('idx_unique_doc_user')
    col.removeIndex('idx_unique_email_user')

    app.save(col)
  },
)
