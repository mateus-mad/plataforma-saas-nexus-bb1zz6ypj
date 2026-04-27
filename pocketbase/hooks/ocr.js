routerAdd(
  'POST',
  '/backend/v1/ocr',
  (e) => {
    const body = e.requestInfo().body
    let base64 = body.image
    if (!base64) {
      throw new BadRequestError('Nenhum arquivo enviado para processamento.')
    }

    const isPdf =
      base64.includes('application/pdf') ||
      base64.includes('data:application/pdf') ||
      body.docType === 'PDF' ||
      base64.startsWith('JVBERi0')

    if (!base64.startsWith('data:')) {
      if (isPdf) {
        base64 = 'data:application/pdf;base64,' + base64
      } else {
        base64 = 'data:image/jpeg;base64,' + base64
      }
    }

    const apiKey = $secrets.get('OPENAI_API_KEY')
    if (!apiKey) {
      return e.json(400, {
        code: 'ERR_CONFIG',
        message: 'Chave de API não configurada. Verifique as Integrações no painel do Skip.',
      })
    }

    let extractedText = ''

    if (isPdf) {
      let formData =
        'base64Image=' +
        encodeURIComponent(base64) +
        '&language=por&isOverlayRequired=false&scale=true&OCREngine=2&filetype=PDF'

      try {
        const ocrRes = $http.send({
          url: 'https://api.ocr.space/parse/image',
          method: 'POST',
          headers: {
            apikey: 'helloworld',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
          timeout: 120,
        })

        const ocrData = ocrRes.json || {}
        if (
          ocrRes.statusCode === 200 &&
          ocrData.ParsedResults &&
          ocrData.ParsedResults.length > 0
        ) {
          extractedText = ocrData.ParsedResults.map((r) => r.ParsedText).join('\n') || ''
        }
      } catch (err) {
        console.log('OCR.space fallback falhou:', err)
      }

      if (!extractedText || extractedText.length < 10) {
        return e.json(400, {
          code: 'ERR_CONTENT',
          message:
            'Não foi possível ler o documento. Certifique-se de que a foto está nítida e bem iluminada.',
        })
      }
    }

    const promptText = `
Você é um assistente especializado em extração de dados de documentos brasileiros (RG, CNH, CPF, Cartão CNPJ).
${isPdf ? 'Analise o texto extraído do documento abaixo e estruture os dados:' : 'Analise a imagem fornecida. Corrija mentalmente a orientação, brilho e contraste se necessário, e extraia os campos:'}

Regras Estritas:
1. Datas: Converta QUALQUER formato de data encontrado (ex: DD/MM/AAAA) ESTRITAMENTE para o formato ISO "YYYY-MM-DD". Ex: se ler 15/05/1990, retorne 1990-05-15.
2. Números de Documento: Limpe os números (CPF, RG, CNPJ), removendo TODOS os pontos, traços e barras. Retorne apenas caracteres alfanuméricos.
3. Gênero: Mapeie 'gender' ESTRITAMENTE para "masc", "fem", ou "outros". Se não especificado, use "".
4. Filiação: 'parents_names' deve conter os nomes da mãe e do pai separados por " / " (ex: "Maria da Silva / João da Silva").
5. CNPJ: Se for um Cartão CNPJ, preencha razao_social, nome_fantasia, cnpj e cnae.
6. Telefone: Se encontrar um telefone ou celular, formate para o padrão (XX) XXXXX-XXXX.
7. Confiança: Para 'confidence', retorne um número de 0 a 100. Se for ilegível, retorne baixo (ex: 10).
8. Se um campo não for encontrado, retorne uma string vazia "".

${isPdf ? 'Texto extraído do documento:\n' + extractedText : ''}`

    const messages = [
      {
        role: 'system',
        content: promptText,
      },
      {
        role: 'user',
        content: isPdf
          ? 'Extraia os dados do texto fornecido.'
          : [
              { type: 'text', text: 'Extraia os dados desta imagem de documento.' },
              { type: 'image_url', image_url: { url: base64 } },
            ],
      },
    ]

    try {
      const res = $http.send({
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'document_extraction',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  document_number: { type: 'string' },
                  birth_date: { type: 'string', description: 'YYYY-MM-DD' },
                  hire_date: { type: 'string', description: 'YYYY-MM-DD' },
                  docType: {
                    type: 'string',
                    enum: ['RG', 'CNH', 'CPF', 'Passaporte', 'CNPJ', 'Outro', ''],
                  },
                  pis_pasep: { type: 'string' },
                  docIssueDate: { type: 'string', description: 'YYYY-MM-DD' },
                  expiryDate: { type: 'string', description: 'YYYY-MM-DD' },
                  parents_names: { type: 'string' },
                  nationality: { type: 'string' },
                  birth_city: { type: 'string' },
                  birth_uf: { type: 'string' },
                  gender: { type: 'string', enum: ['masc', 'fem', 'outros', ''] },
                  cnpj: { type: 'string' },
                  razao_social: { type: 'string' },
                  nome_fantasia: { type: 'string' },
                  cnae: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  address: {
                    type: 'object',
                    properties: {
                      cep: { type: 'string' },
                      logradouro: { type: 'string' },
                      numero: { type: 'string' },
                      bairro: { type: 'string' },
                      cidade: { type: 'string' },
                      estado: { type: 'string' },
                    },
                    required: ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'],
                    additionalProperties: false,
                  },
                  confidence: { type: 'integer' },
                  field_confidences: {
                    type: 'object',
                    properties: {
                      name: { type: 'integer' },
                      document_number: { type: 'integer' },
                      birth_date: { type: 'integer' },
                      parents_names: { type: 'integer' },
                      cnpj: { type: 'integer' },
                    },
                    required: ['name', 'document_number', 'birth_date', 'parents_names', 'cnpj'],
                    additionalProperties: false,
                  },
                  raw_fields: {
                    type: 'object',
                    properties: {
                      cpf: { type: 'string' },
                      rg: { type: 'string' },
                      mae: { type: 'string' },
                      pai: { type: 'string' },
                    },
                    required: ['cpf', 'rg', 'mae', 'pai'],
                    additionalProperties: false,
                  },
                },
                required: [
                  'name',
                  'document_number',
                  'birth_date',
                  'docType',
                  'pis_pasep',
                  'docIssueDate',
                  'expiryDate',
                  'parents_names',
                  'nationality',
                  'birth_city',
                  'birth_uf',
                  'gender',
                  'cnpj',
                  'razao_social',
                  'nome_fantasia',
                  'cnae',
                  'phone',
                  'email',
                  'address',
                  'confidence',
                  'field_confidences',
                  'raw_fields',
                ],
                additionalProperties: false,
              },
            },
          },
          messages: messages,
        }),
        timeout: 120,
      })

      if (res.statusCode !== 200) {
        if (res.statusCode === 401) {
          return e.json(400, {
            code: 'ERR_CONFIG',
            message: 'Chave de API não configurada. Verifique as Integrações no painel do Skip.',
          })
        } else if (res.statusCode === 429 || res.statusCode >= 500) {
          return e.json(400, {
            code: 'ERR_SERVICE',
            message:
              'O serviço de inteligência está temporariamente indisponível. Tente preencher manualmente.',
          })
        } else {
          return e.json(400, {
            code: 'ERR_SERVICE',
            message:
              'O serviço de inteligência está temporariamente indisponível. Tente preencher manualmente.',
          })
        }
      }

      const data = res.json
      const content = data.choices[0].message.content
      const parsed = JSON.parse(content)

      if (parsed.confidence < 40) {
        return e.json(400, {
          code: 'ERR_CONTENT',
          message:
            'Não foi possível ler o documento. Certifique-se de que a foto está nítida e bem iluminada.',
        })
      }

      return e.json(200, {
        name: parsed.name || parsed.razao_social || '',
        document_number:
          parsed.cnpj ||
          parsed.document_number ||
          parsed.raw_fields?.cpf ||
          parsed.raw_fields?.rg ||
          '',
        birth_date: parsed.birth_date || '',
        hire_date: parsed.hire_date || '',
        parents_names: parsed.parents_names || '',
        gender: parsed.gender || '',
        birth_city: parsed.birth_city || '',
        birth_uf: parsed.birth_uf || '',
        nationality: parsed.nationality || '',
        docType: parsed.docType || (parsed.cnpj ? 'CNPJ' : 'Outro'),
        pis_pasep: parsed.pis_pasep || '',
        docIssueDate: parsed.docIssueDate || '',
        expiryDate: parsed.expiryDate || '',
        mae: parsed.raw_fields?.mae || '',
        pai: parsed.raw_fields?.pai || '',
        cpf: parsed.raw_fields?.cpf || '',
        rg: parsed.raw_fields?.rg || '',
        cnpj: parsed.cnpj || '',
        razao_social: parsed.razao_social || '',
        nome_fantasia: parsed.nome_fantasia || '',
        cnae: parsed.cnae || '',
        phone: parsed.phone || '',
        email: parsed.email || '',
        raw_text: content,
        confidence: parsed.confidence || 85,
        field_confidences: parsed.field_confidences || {},
        field_coordinates: {},
        address: parsed.address || {
          cep: '',
          logradouro: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
      })
    } catch (err) {
      if (extractedText) {
        const cpfMatch = extractedText.match(/\d{3}\.\d{3}\.\d{3}\-\d{2}/)
        const cnpjMatch = extractedText.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}/)
        if (cpfMatch || cnpjMatch) {
          return e.json(200, {
            name: '',
            document_number: (cnpjMatch ? cnpjMatch[0] : cpfMatch[0]).replace(/[^\d]/g, ''),
            docType: cnpjMatch ? 'CNPJ' : 'CPF',
            confidence: 50,
            fallback_used: true,
            raw_text: extractedText,
          })
        }
      }

      return e.json(400, {
        code: 'ERR_SERVICE',
        message:
          'O serviço de inteligência está temporariamente indisponível. Tente preencher manualmente.',
      })
    }
  },
  $apis.bodyLimit(20 * 1024 * 1024),
)
