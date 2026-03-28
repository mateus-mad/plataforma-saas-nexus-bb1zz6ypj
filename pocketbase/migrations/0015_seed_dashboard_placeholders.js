migrate(
  (app) => {
    const configs = app.findCollectionByNameOrId('configurations')

    const seedData = [
      { name: 'Engenharia', type: 'setor' },
      { name: 'Recursos Humanos', type: 'setor' },
      { name: 'Financeiro', type: 'setor' },
      { name: 'Operacional', type: 'setor' },
      { name: 'Engenheiro Civil', type: 'cargo' },
      { name: 'Analista Financeiro', type: 'cargo' },
      { name: 'Assistente Administrativo', type: 'cargo' },
      { name: 'Mestre de Obras', type: 'cargo' },
      { name: '44h Semanais - Seg a Sex', type: 'jornada' },
      { name: '12x36 - Plantão', type: 'jornada' },
    ]

    seedData.forEach((data) => {
      const existing = app.findRecordsByFilter(
        'configurations',
        "name = '" + data.name + "' && type = '" + data.type + "'",
        '',
        1,
        0,
      )

      if (existing.length === 0) {
        const record = new Record(configs)
        record.set('name', data.name)
        record.set('type', data.type)
        app.save(record)
      }
    })
  },
  (app) => {
    const seedNames = [
      'Engenharia',
      'Recursos Humanos',
      'Financeiro',
      'Operacional',
      'Engenheiro Civil',
      'Analista Financeiro',
      'Assistente Administrativo',
      'Mestre de Obras',
      '44h Semanais - Seg a Sex',
      '12x36 - Plantão',
    ]

    seedNames.forEach((name) => {
      const records = app.findRecordsByFilter('configurations', "name = '" + name + "'", '', 10, 0)
      records.forEach((r) => app.delete(r))
    })
  },
)
