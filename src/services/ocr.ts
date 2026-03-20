import pb from '@/lib/pocketbase/client'

export const processDocumentOCR = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return pb.send('/backend/v1/ocr', {
    method: 'POST',
    body: formData,
  })
}
