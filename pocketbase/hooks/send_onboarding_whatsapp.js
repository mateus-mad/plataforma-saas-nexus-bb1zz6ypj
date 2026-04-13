routerAdd(
  'POST',
  '/backend/v1/send-onboarding/{id}',
  (e) => {
    const id = e.request.pathValue('id')
    const rel = $app.findRecordById('relacionamentos', id)

    let token = rel.get('onboarding_token')
    if (!token) {
      token = $security.randomString(16)
      rel.set('onboarding_token', token)
      $app.save(rel)
    }

    const origin = e.request.header.get('Origin') || 'https://plataforma-saas-bf8b5.goskip.app'
    const link = `${origin}/onboarding/${token}`

    // Optionally, if we had a real WhatsApp API bound to whatsapp_configs,
    // we would fetch it and send the message here.
    // For the MVP, we just return the link to open via WhatsApp Web.

    return e.json(200, { success: true, link: link, token: token })
  },
  $apis.requireAuth(),
)
