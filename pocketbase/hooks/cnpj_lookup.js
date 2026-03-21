routerAdd(
  'GET',
  '/backend/v1/cnpj/{cnpj}',
  (e) => {
    const rawCnpj = e.request.pathValue('cnpj')
    const cnpj = rawCnpj.replace(/\D/g, '')

    if (cnpj.length !== 14) {
      throw new BadRequestError('CNPJ inválido')
    }

    try {
      const res = $http.send({
        url: 'https://brasilapi.com.br/api/cnpj/v1/' + cnpj,
        method: 'GET',
        timeout: 15,
      })

      if (res.statusCode === 200) {
        return e.json(200, res.json)
      }

      if (res.statusCode === 404) {
        throw new NotFoundError('CNPJ não encontrado na base de dados.')
      }

      // Handle other non-200 responses without crashing
      return e.json(502, {
        error: 'bad_gateway',
        message: 'O serviço de consulta retornou um erro inesperado.',
      })
    } catch (err) {
      // Catch network-level errors (like DNS lookup failed, timeouts, connection refused)
      // and return a clear JSON error instead of a generic 500 stack trace.
      return e.json(503, {
        error: 'serviço_indisponivel',
        message: 'Não foi possível conectar ao serviço de consulta de CNPJ.',
      })
    }
  },
  $apis.requireAuth(),
)
