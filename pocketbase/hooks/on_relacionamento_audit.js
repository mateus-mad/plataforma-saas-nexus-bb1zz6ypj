onRecordUpdate(
  (e) => {
    try {
      const oldRecord = e.record.originalCopy()
      if (!oldRecord) {
        e.next()
        return
      }

      const skipFields = ['id', 'created', 'updated', 'user_id']
      let oldValues = {}
      let newValues = {}
      let changedFields = []

      const newExport = e.record.export()
      const oldExport = oldRecord.export()

      for (const key of Object.keys(newExport)) {
        if (skipFields.includes(key)) continue

        const oldVal = oldExport[key]
        const newVal = newExport[key]

        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          oldValues[key] = oldVal
          newValues[key] = newVal
          changedFields.push(key)
        }
      }

      if (changedFields.length > 0) {
        const auditCol = $app.findCollectionByNameOrId('audit_logs')
        const auditRecord = new Record(auditCol)

        let userId = e.record.get('user_id')
        if (e.collection.name === 'contracts') {
          const relId = e.record.get('relacionamento_id')
          if (relId) {
            try {
              const rel = $app.findRecordById('relacionamentos', relId)
              userId = rel.get('user_id')
            } catch (err) {}
          }
        }

        auditRecord.set(
          'relacionamento_id',
          e.collection.name === 'relacionamentos' ? e.record.id : e.record.get('relacionamento_id'),
        )
        auditRecord.set('user_id', userId)
        auditRecord.set('action', 'UPDATE')
        auditRecord.set('module', e.collection.name)
        auditRecord.set('field_name', changedFields.join(', '))
        auditRecord.set('old_value', oldValues)
        auditRecord.set('new_value', newValues)

        $app.saveNoValidate(auditRecord)
      }
    } catch (err) {
      console.log('Audit error:', err)
    }
    e.next()
  },
  'relacionamentos',
  'contracts',
)
