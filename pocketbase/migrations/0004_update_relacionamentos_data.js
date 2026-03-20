migrate(
  (app) => {
    const records = app.findRecordsByFilter('relacionamentos', "type = 'colaborador'", '', 1000, 0)
    for (let r of records) {
      let data = r.get('data')
      if (!data) data = {}
      if (!data.docs) data.docs = {}

      if (!data.docs.expiryDate) {
        const rand = Math.random()
        let d = new Date()
        if (rand < 0.2) d.setDate(d.getDate() - 5)
        else if (rand < 0.5) d.setDate(d.getDate() + 15)
        else d.setFullYear(d.getFullYear() + 1)

        data.docs.expiryDate = d.toISOString().split('T')[0]
        r.set('data', data)
        app.saveNoValidate(r)
      }
    }
  },
  (app) => {
    // Irreversible
  },
)
