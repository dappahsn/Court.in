/**
 * High-performance browser-side image compressor.
 * Resizes avatar to max 256x256 and outputs optimized JPEG data URL (~15-30KB).
 * Prevents localStorage QuotaExceeded errors and guarantees instant rendering.
 */
export async function compressAvatar(file, maxWidth = 256, maxHeight = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Square crop / proportional resize
        const minDim = Math.min(width, height)
        const startX = (width - minDim) / 2
        const startY = (height - minDim) / 2

        canvas.width = maxWidth
        canvas.height = maxHeight

        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxWidth, maxHeight)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}
