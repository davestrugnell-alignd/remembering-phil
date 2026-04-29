const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    '[cloudinary] Missing env vars. Copy .env.example to .env and fill in your Cloudinary credentials.'
  )
}

/**
 * Upload a file directly to Cloudinary (unsigned upload).
 *
 * @param {File}    file          - The File object to upload
 * @param {Function} onProgress   - Called with a number 0-100 as upload progresses
 * @returns {Promise<{ secure_url: string, resource_type: string }>}
 */
export function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    // Detect resource type so Cloudinary handles video correctly
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve({ secure_url: data.secure_url, resource_type: resourceType })
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.statusText}`))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))

    xhr.open('POST', url)
    xhr.send(formData)
  })
}

/** Maximum allowed upload size in bytes (100 MB) */
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024

/** Accepted MIME types for validation */
export const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]
