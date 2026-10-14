/**
 * Upload size guard. Hosting platforms cap request bodies (Vercel: 4.5 MB), so
 * a phone photo straight from the camera (3–5 MB each) can make a paid order
 * fail to submit. Photos are shrunk in the browser before upload.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

const MAX_SIDE = 1800
const QUALITY = 0.82

/** Re-encodes an image as a smaller JPEG. Non-images (PDF) and failures pass through unchanged. */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.size < 400_000) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', QUALITY))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}
