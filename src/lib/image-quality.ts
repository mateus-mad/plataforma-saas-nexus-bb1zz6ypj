export const checkImageQuality = async (
  file: File,
): Promise<{ isLowQuality: boolean; reason?: string }> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve({ isLowQuality: false })

      // Scale down for faster processing
      canvas.width = Math.min(img.width, 800)
      canvas.height = Math.min(img.height, 800)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      let colorSum = 0
      let count = 0
      // Sample every 16th pixel to calculate average brightness
      for (let x = 0; x < data.length; x += 16) {
        const r = data[x]
        const g = data[x + 1]
        const b = data[x + 2]
        colorSum += Math.floor((r + g + b) / 3)
        count++
      }

      const brightness = Math.floor(colorSum / count)

      // Thresholds for extreme darkness or brightness
      if (brightness < 40) {
        resolve({ isLowQuality: true, reason: 'Image is too dark.' })
      } else if (brightness > 230) {
        resolve({ isLowQuality: true, reason: 'Image is too bright or overexposed.' })
      } else {
        resolve({ isLowQuality: false })
      }
    }
    img.onerror = () => resolve({ isLowQuality: false })
    img.src = url
  })
}
