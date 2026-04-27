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
      base64.startsWith('JVBERi0') // magic number PDF

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
          'Não foi possível ler o documento claramente, por favor tente uma foto de maior qualidade.',
          {
            code: 'validation_unreadable',
          },
        )
      }
    }

    const promptText = `
Você é um assistente especializado em extração de dados de documentos de identificação brasileiros (RG, CNH, CPF).
${isPdf ? 'Analise o texto extraído do documento abaixo e estruture os dados:' : 'Analise a imagem fornecida e extraia os seguintes campos:'}
Retorne ESTRITAMENTE no formato JSON abaixo.
Se um campo não for encontrado, retorne uma string vazia "".
Para o campo "confidence", retorne um número inteiro de 0 a 100 indicando a sua confiança geral na extração.
Para "field_confidences", retorne um número inteiro de 0 a 100 para cada campo extraído.

Formato esperado:
{
  "name": "Nome Completo",
  "document_number": "Número do CPF ou RG com pontuação",
  "birth_date": "YYYY-MM-DD",
  "docType": "RG ou CNH ou CPF",
  "pis": "000.00000.00-0",
  "docIssueDate": "YYYY-MM-DD",
  "expiryDate": "YYYY-MM-DD",
  "parents_names": "Nome da Mãe e/ou Nome do Pai (ex: Maria da Silva / João da Silva)",
  "nationality": "Brasileira",
  "birth_city": "Cidade",
  "birth_uf": "UF",
  "gender": "masc ou fem ou outros",
  "address": {
    "cep": "",
    "logradouro": "",
    "numero": "",
    "bairro": "",
    "cidade": "",
    "estado": ""
  },
  "confidence": 95,
  "field_confidences": {
    "name": 95,
    "document_number": 90
  },
  "raw_fields": {
    "cpf": "000.000.000-00",
    "rg": "00.000.000-0",
    "mae": "Nome da mãe",
    "pai": "Nome do pai"
  }
}

Importante: 
- Mapeie 'gender' estritamente para "masc", "fem", ou "outros".
- Mapeie datas preferencialmente para formato YYYY-MM-DD.
- 'parents_names' deve conter os nomes da mãe e do pai separados por " / ".

${isPdf ? 'Texto extraído do documento:\n' + extractedText : ''}`

    const messages = [
      {
        role: 'user',
        content: isPdf
          ? [{ type: 'text', text: promptText }]
          : [
              { type: 'text', text: promptText },
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
          response_format: { type: 'json_object' },
          messages: messages,
        }),
        timeout: 120,
      })

      if (res.statusCode !== 200) {
        console.log('OpenAI Error:', res.raw || JSON.stringify(res.json))
        throw new InternalServerError(
          'Erro na comunicação com o motor de IA da OpenAI. Tente novamente mais tarde.',
        )
      }

      const data = res.json
      const content = data.choices[0].message.content
      const parsed = JSON.parse(content)

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
        pis: parsed.pis || '',
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
        'Não foi possível ler o documento claramente, por favor tente uma foto de maior qualidade.',
        { code: 'validation_unreadable' },
      )
    }
  },
  $apis.bodyLimit(20 * 1024 * 1024),
)
