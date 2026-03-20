routerAdd(
  'POST',
  '/backend/v1/ocr',
  (e) => {
    const files = e.findUploadedFiles('file')
    if (!files || files.length === 0) {
      throw new BadRequestError('Nenhum arquivo enviado para processamento.')
    }

    // In a real scenario, this would send the file to an external OCR API (like Google Vision or AWS Textract).
    // Here we return realistic mock data to simulate a successful extraction of a Brazilian ID document.
    const extracted = {
      name: 'Carlos Drummond de Andrade',
      document_number: '123.456.789-00',
      docType: 'RG',
      docIssueDate: '2015-08-20',
      pis: '123.45678.90-1',
      nascimento: '1980-05-12',
      mae: 'Julieta Augusta Drummond de Andrade',
      nacionalidade: 'Brasileira',
      cidadeNasc: 'Itabira',
      ufNasc: 'MG',
      photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=carlos',
      address: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1578',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
      },
      compliance: {
        status: 'valid',
        message: 'Documento extraído e validado com sucesso via OCR público.',
      },
    }

    return e.json(200, extracted)
  },
  $apis.requireAuth(),
)
