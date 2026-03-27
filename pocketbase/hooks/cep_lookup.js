/**
 * GET /backend/v1/cep-lookup/{cep}
 * Input: cep (string, 8 digits)
 * Output: { cep, logradouro, complemento, bairro, cidade, estado }
 */
routerAdd(
  'GET',
  '/backend/v1/cep-lookup/{cep}',
  (e) => {
    const rawCep = e.request.pathValue('cep')
    const cep = rawCep.replace(/\D/g, '')

    if (cep.length !== 8) {
      return e.json(400, { error: 'bad_request', message: 'CEP inválido' })
    }

    try {
      const res = $http.send({
        url: 'https://viacep.com.br/ws/' + cep + '/json/',
        method: 'GET',
        timeout: 10,
      })

      if (res.statusCode === 200) {
        const data = res.json || {}
        if (data.erro) {
          return e.json(404, {
            error: 'not_found',
            message: 'CEP não encontrado na base de dados.',
          })
        }
        return e.json(200, {
          cep: data.cep,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        })
      }

      return e.json(res.statusCode || 502, {
        error: 'bad_gateway',
        message: 'O serviço de consulta retornou um erro inesperado.',
      })
    } catch (err) {
      return e.json(503, {
        error: 'servico_indisponivel',
        message:
          'Serviço de consulta de CEP temporariamente indisponível. Por favor preencha manualmente.',
      })
    }
  },
  $apis.requireAuth(),
)
