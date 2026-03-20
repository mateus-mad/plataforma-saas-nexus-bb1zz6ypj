import pb from '@/lib/pocketbase/client'

export const processDocumentOCR = async (file: File) => {
  const reader = new FileReader()
  const base64 = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  return pb.send('/backend/v1/ocr', {
    method: 'POST',
    body: JSON.stringify({ image: base64 }),
    headers: { 'Content-Type': 'application/json' },
  })
}
