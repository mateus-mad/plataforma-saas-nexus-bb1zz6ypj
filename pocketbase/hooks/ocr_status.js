routerAdd(
  'GET',
  '/backend/v1/ocr/status',
  (e) => {
    const apiKey = $secrets.get('OPENAI_API_KEY')
    return e.json(200, { configured: !!apiKey })
  },
  $apis.requireAuth(),
)
