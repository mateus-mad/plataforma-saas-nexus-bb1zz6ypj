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

      if (res.statusCode !== 200) {
        throw new BadRequestError('Erro ao consultar CNPJ na Receita Federal')
      }

      return e.json(200, res.json)
    } catch (err) {
      throw new InternalServerError('Falha na comunicação com a API: ' + err.message)
    }
  },
  $apis.requireAuth(),
)
