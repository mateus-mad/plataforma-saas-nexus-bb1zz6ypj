onRecordCreate((e) => {
  const userId = e.record.getString('user_id')
  if (userId) {
    try {
      const rel = $app.findFirstRecordByData('relacionamentos', 'login_user_id', userId)
      e.record.set('relacionamento_id', rel.id)
    } catch (_) {}
  }
  return e.next()
}, 'time_entries')
