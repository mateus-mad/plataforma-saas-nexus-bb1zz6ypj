migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')

    const addField = (field) => {
      if (!col.fields.getByName(field.name)) {
        col.fields.add(field)
      }
    }

    // Nested structures
    addField(new JSONField({ name: 'address_json' }))
    addField(new JSONField({ name: 'work_details' }))
    addField(new JSONField({ name: 'salary_details' }))
    addField(new JSONField({ name: 'benefits_config' }))
    addField(new JSONField({ name: 'financial_metrics' }))

    // Specific data fields
    addField(new TextField({ name: 'nationality' }))
    addField(new SelectField({ name: 'gender', values: ['masc', 'fem', 'outros'], maxSelect: 1 }))
    addField(new TextField({ name: 'parents_names' }))
    addField(new TextField({ name: 'birth_city' }))
    addField(new TextField({ name: 'birth_uf' }))
    addField(new DateField({ name: 'birth_date' }))
    addField(new TextField({ name: 'pis_pasep' }))
    addField(new DateField({ name: 'doc_emission_date' }))
    addField(new TextField({ name: 'doc_type' }))
    addField(new DateField({ name: 'hire_date' }))
    addField(new DateField({ name: 'termination_date' }))

    // Ensure strict API Rules
    col.listRule = 'user_id = @request.auth.id'
    col.viewRule = 'user_id = @request.auth.id'
    col.createRule = 'user_id = @request.auth.id'
    col.updateRule = 'user_id = @request.auth.id'
    col.deleteRule = 'user_id = @request.auth.id'

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')

    const fieldsToRemove = [
      'address_json',
      'work_details',
      'salary_details',
      'benefits_config',
      'financial_metrics',
      'nationality',
      'gender',
      'parents_names',
      'birth_city',
      'birth_uf',
      'birth_date',
      'pis_pasep',
      'doc_emission_date',
      'doc_type',
      'hire_date',
      'termination_date',
    ]

    fieldsToRemove.forEach((name) => {
      const field = col.fields.getByName(name)
      if (field) {
        col.fields.removeById(field.id)
      }
    })

    app.save(col)
  },
)
