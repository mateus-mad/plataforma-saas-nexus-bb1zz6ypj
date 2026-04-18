onRecordCreate((e) => {
  const userId = e.record.getString('user_id')
  if (userId) {
    try {
      const rel = $app.findFirstRecordByData('relacionamentos', 'login_user_id', userId)
      e.record.set('relacionamento_id', rel.id)
    } catch (_) {}
  }

  const lat1 = e.record.getFloat('latitude')
  const lon1 = e.record.getFloat('longitude')
  const siteId = e.record.getString('work_site_id')

  if (lat1 && lon1 && siteId) {
    const site = $app.findRecordById('work_sites', siteId)
    const lat2 = site.getFloat('latitude')
    const lon2 = site.getFloat('longitude')
    const radius = site.getFloat('radius_meters')

    const R = 6371e3
    const phi1 = (lat1 * Math.PI) / 180
    const phi2 = (lat2 * Math.PI) / 180
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    if (distance > radius) {
      throw new BadRequestError('Localização fora do perímetro permitido para esta obra.')
    }
  }

  return e.next()
}, 'time_entries')
