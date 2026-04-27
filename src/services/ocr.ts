import pb from '@/lib/pocketbase/client'

export const processDocumentOCR = async (file: File, docType: string = 'RG') => {
  const reader = new FileReader()
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const controller = new AbortController()
  // 45 seconds timeout for OCR processing to handle connectivity issues gracefully
  const timeoutId = setTimeout(() => controller.abort(), 45000)

  try {
    const response = await pb.send('/backend/v1/ocr', {
      method: 'POST',
      body: JSON.stringify({ image: base64, docType }),
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError' || error.isAbort) {
      error.message =
        'O servidor demorou muito para responder (timeout). Por favor, utilize o preenchimento manual.'
      throw error
    }

    if (error?.response?.code) {
      error.code = error.response.code
      error.message = error.response.message
    } else if (error?.response?.message) {
      error.message = error.response.message
    } else if (error.status === 0 || error.message === 'Failed to fetch') {
      error.code = 'ERR_SERVICE'
      error.message =
        'O serviço de inteligência está temporariamente indisponível. Tente preencher manualmente.'
    }

    throw error
  }
}
