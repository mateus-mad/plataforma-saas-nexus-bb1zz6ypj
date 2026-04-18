onRecordCreateRequest((e) => {
  const body = e.requestInfo().body
  const workSiteId = body.work_site_id || e.record.getString('work_site_id')

  if (workSiteId) {
    try {
      const workSite = $app.findRecordById('work_sites', workSiteId)
      const siteLat = workSite.getFloat('latitude')
      const siteLon = workSite.getFloat('longitude')
      const radius = workSite.getInt('radius_meters')

      const userLat = body.latitude || e.record.getFloat('latitude')
      const userLon = body.longitude || e.record.getFloat('longitude')

      if (userLat === 0 && userLon === 0) {
        throw new BadRequestError('Localização obrigatória.')
      }

      const R = 6371e3
      const rad = Math.PI / 180
      const lat1 = siteLat * rad
      const lat2 = userLat * rad
      const dLat = (userLat - siteLat) * rad
      const dLon = (userLon - siteLon) * rad

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      if (distance > radius) {
        throw new BadRequestError('Você está fora do perímetro permitido para esta obra.')
      }
    } catch (err) {
      if (err.name === 'BadRequestError') throw err
      throw new BadRequestError('Erro ao validar perímetro da obra.')
    }
  }

  const userId = body.user_id || e.record.getString('user_id')
  if (userId && !e.record.getString('relacionamento_id')) {
    try {
      const rel = $app.findFirstRecordByData('relacionamentos', 'user_id', userId)
      e.record.set('relacionamento_id', rel.id)
    } catch (_) {
      // Ignore if user has no relacionamento record
    }
  }

  e.next()
}, 'time_entries')
