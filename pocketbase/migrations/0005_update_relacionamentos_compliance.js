migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.fields.add(new DateField({ name: 'expiry_date' }))
    col.fields.add(
      new SelectField({
        name: 'compliance_status',
        values: ['pendente', 'em_dia', 'vencido'],
        maxSelect: 1,
      }),
    )
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('relacionamentos')
    col.fields.removeByName('expiry_date')
    col.fields.removeByName('compliance_status')
    app.save(col)
  },
)
