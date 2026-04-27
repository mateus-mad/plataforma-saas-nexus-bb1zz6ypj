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
      throw new InternalServerError(
        'A chave de API da OpenAI (OPENAI_API_KEY) não está configurada no servidor.',
      )
    }

    let extractedText = ''

    if (isPdf) {
      let formData =
        'base64Image=' +
        encodeURIComponent(base64) +
        '&language=por&isOverlayRequired=false&scale=true&OCREngine=2&filetype=PDF'

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
      if (ocrRes.statusCode === 200 && ocrData.ParsedResults && ocrData.ParsedResults.length > 0) {
        extractedText = ocrData.ParsedResults.map((r) => r.ParsedText).join('\n') || ''
      }

      if (!extractedText || extractedText.length < 10) {
        throw new BadRequestError(
          'Não foi possível extrair texto do PDF. O documento pode estar protegido ou ser uma imagem ilegível.',
          { code: 'validation_unreadable' },
        )
      }
    }

    const promptText = `
Você é um assistente especializado em extração de dados de documentos de identificação brasileiros (RG, CNH, CPF).
${isPdf ? 'Analise o texto extraído do documento abaixo e estruture os dados:' : 'Analise a imagem fornecida (corrija mentalmente a orientação se estiver rotacionada) e extraia os campos:'}
Se o documento for ilegível ou não for um documento de identificação válido, retorne confidence baixo (ex: 10) e campos vazios.

Regras Estritas:
1. Mapeie 'gender' ESTRITAMENTE para "masc", "fem", ou "outros". Se não especificado, use "".
2. Mapeie TODAS as datas ESTRITAMENTE para o formato ISO "YYYY-MM-DD". Se a data for 15/05/1990, retorne 1990-05-15.
3. 'parents_names' deve conter os nomes da mãe e do pai separados por " / " (ex: "Maria da Silva / João da Silva"). Se houver apenas a mãe, retorne "Maria da Silva / ".
4. Para o campo "confidence", retorne um número inteiro de 0 a 100 indicando a sua confiança geral na extração legível do documento.
5. Se um campo não for encontrado, retorne uma string vazia "".

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
                  docType: {
                    type: 'string',
                    enum: ['RG', 'CNH', 'CPF', 'Passaporte', 'Outro', ''],
                  },
                  pis_pasep: { type: 'string' },
                  docIssueDate: { type: 'string', description: 'YYYY-MM-DD' },
                  expiryDate: { type: 'string', description: 'YYYY-MM-DD' },
                  parents_names: { type: 'string' },
                  nationality: { type: 'string' },
                  birth_city: { type: 'string' },
                  birth_uf: { type: 'string' },
                  gender: { type: 'string', enum: ['masc', 'fem', 'outros', ''] },
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
                    },
                    required: ['name', 'document_number', 'birth_date', 'parents_names'],
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
        console.log('OpenAI Error:', res.raw || JSON.stringify(res.json))
        throw new InternalServerError(
          'Erro na comunicação com o motor de IA da OpenAI. Verifique a configuração da chave de API ou tente novamente.',
        )
      }

      const data = res.json
      const content = data.choices[0].message.content
      const parsed = JSON.parse(content)

      if (parsed.confidence < 40) {
        throw new BadRequestError(
          'A imagem está ilegível, borrada ou o documento não é suportado. Por favor, envie uma imagem com melhor qualidade.',
          { code: 'validation_low_resolution' },
        )
      }

      return e.json(200, {
        name: parsed.name || '',
        document_number:
          parsed.document_number || parsed.raw_fields?.cpf || parsed.raw_fields?.rg || '',
        birth_date: parsed.birth_date || '',
        parents_names: parsed.parents_names || '',
        gender: parsed.gender || '',
        birth_city: parsed.birth_city || '',
        birth_uf: parsed.birth_uf || '',
        nationality: parsed.nationality || '',
        docType: parsed.docType || 'Outro',
        pis: parsed.pis_pasep || parsed.pis || '',
        docIssueDate: parsed.docIssueDate || '',
        expiryDate: parsed.expiryDate || '',
        mae: parsed.raw_fields?.mae || '',
        pai: parsed.raw_fields?.pai || '',
        cpf: parsed.raw_fields?.cpf || '',
        rg: parsed.raw_fields?.rg || '',
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
      if (err.status) throw err
      throw new BadRequestError(
        'Falha inesperada no processamento do documento. Tente novamente mais tarde.',
        { code: 'validation_unreadable' },
      )
    }
  },
  $apis.bodyLimit(20 * 1024 * 1024),
)
