routerAdd(
  'POST',
  '/backend/v1/ocr',
  (e) => {
    const body = e.requestInfo().body
    const base64 = body.image
    if (!base64) {
      throw new BadRequestError('Nenhum arquivo enviado para processamento.')
    }

    const formData =
      'base64Image=' + encodeURIComponent(base64) + '&language=por&isOverlayRequired=false'

    try {
      const res = $http.send({
        url: 'https://api.ocr.space/parse/image',
        method: 'POST',
        headers: {
          apikey: 'helloworld',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        timeout: 30,
      })

      if (res.statusCode !== 200) {
        throw new BadRequestError(
          'Unable to read document. Please check the image quality or fill fields manually.',
        )
      }

      const data = res.json
      if (
        !data ||
        data.IsErroredOnProcessing ||
        !data.ParsedResults ||
        data.ParsedResults.length === 0
      ) {
        throw new BadRequestError(
          'Unable to read document. Please check the image quality or fill fields manually.',
        )
      }

      const text = data.ParsedResults[0].ParsedText || ''

      if (!text || text.length < 10) {
        throw new BadRequestError(
          'Unable to read document. Please check the image quality or fill fields manually.',
        )
      }

      const cpfMatch = text.match(/\d{3}[\.\s]?\d{3}[\.\s]?\d{3}[-\s]?\d{2}/)
      const cpf = cpfMatch
        ? cpfMatch[0]
            .replace(/[^\d-]/g, '')
            .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        : ''

      const rgMatch = text.match(/(?:RG|R\.G\.|Registro Geral)[^\d]*([\d\.-]+)/i)
      const rg = rgMatch ? rgMatch[1].replace(/[^\d\.-]/g, '') : ''

      const dates = text.match(/\d{2}\/\d{2}\/\d{4}/g) || []
      const nascimento = dates.length > 0 ? dates[0] : ''
      const docIssueDate = dates.length > 1 ? dates[1] : ''

      let name = ''
      const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0)

      for (let i = 0; i < lines.length; i++) {
        if (/(?:NOME|NOME DO TITULAR|IDENTIFICAÇÃO)/i.test(lines[i])) {
          if (lines[i + 1]) {
            name = lines[i + 1]
          }
          break
        }
      }
      if (!name && lines.length > 1) {
        const possibleNames = lines.filter(
          (l) => l === l.toUpperCase() && l.length > 5 && l.length < 40 && !/\d/.test(l),
        )
        if (possibleNames.length > 0) name = possibleNames[0]
      }
      name = name.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim()

      const cepMatch = text.match(/\d{5}-\d{3}/)
      const cep = cepMatch ? cepMatch[0] : ''
      let logradouro = ''
      let numero = ''
      let bairro = ''
      let cidade = ''
      let estado = ''

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i]
        if (/(RUA|AVENIDA|AV\.|PRAÇA|ALAMEDA|RODOVIA|TRAVESSA)/i.test(l)) {
          logradouro = l
          const numMatch = l.match(/\d+/)
          if (numMatch) numero = numMatch[0]
        }
        const ufMatch = l.match(
          /\b(SP|RJ|MG|RS|PR|SC|BA|MS|GO|PE|CE|PA|MA|AM|MT|ES|RN|AL|PB|PI|RO|SE|TO|AP|AC|RR|DF)\b/,
        )
        if (ufMatch && !estado) {
          estado = ufMatch[0]
        }
        if (/BAIRRO|VILA|JARDIM/i.test(l)) {
          bairro = l
        }
      }

      return e.json(200, {
        name: name,
        document_number: cpf || rg,
        docType: cpf ? 'CPF' : rg ? 'RG' : 'Outro',
        nascimento: nascimento,
        docIssueDate: docIssueDate,
        address: {
          cep: cep,
          logradouro: logradouro,
          numero: numero,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
        },
        compliance: {
          status: cpf || name ? 'valid' : 'pending',
          message: 'Processado e validado via OCR com sucesso.',
        },
      })
    } catch (err) {
      if (err instanceof BadRequestError) {
        throw err
      }
      throw new BadRequestError(
        'Unable to read document. Please check the image quality or fill fields manually.',
      )
    }
  },
  $apis.requireAuth(),
)
