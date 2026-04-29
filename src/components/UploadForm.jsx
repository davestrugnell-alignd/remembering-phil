import { useState, useRef } from 'react'
import { uploadToCloudinary, MAX_UPLOAD_BYTES, ACCEPTED_TYPES } from '../lib/cloudinary.js'
import { supabase } from '../lib/supabase.js'

const INITIAL = { name: '', caption: '' }

export default function UploadForm({ onUploaded }) {
  const [fields, setFields] = useState(INITIAL)
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('idle') // 'idle' | 'uploading' | 'saving' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validateFile(f) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, MOV, WebM).'
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      return 'File is too large. Maximum size is 100 MB.'
    }
    return null
  }

  function pickFile(f) {
    const err = validateFile(f)
    if (err) { setErrorMsg(err); return }
    setErrorMsg('')
    setFile(f)
  }

  function handleFileInput(e) {
    const f = e.target.files?.[0]
    if (f) pickFile(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) pickFile(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) { setErrorMsg('Please choose a file first.'); return }

    setStatus('uploading')
    setProgress(0)
    setErrorMsg('')

    let cloudinaryResult
    try {
      cloudinaryResult = await uploadToCloudinary(file, setProgress)
    } catch (err) {
      console.error('[UploadForm] Cloudinary error:', err)
      setErrorMsg('Upload failed. Please check your connection and try again.')
      setStatus('error')
      return
    }

    setStatus('saving')

    const { error } = await supabase.from('media_uploads').insert({
      name: fields.name.trim() || null,
      caption: fields.caption.trim() || null,
      cloudinary_url: cloudinaryResult.secure_url,
      resource_type: cloudinaryResult.resource_type,
    })

    if (error) {
      console.error('[UploadForm] Supabase error:', error)
      setErrorMsg("Your file uploaded but we couldn't save the details. Please contact the site administrator.")
      setStatus('error')
      return
    }

    setStatus('success')
    setFile(null)
    setFields(INITIAL)
    setProgress(0)
    onUploaded?.()
  }

  if (status === 'success') {
    return (
      <div className="form-confirmation" role="alert">
        Thank you for sharing. Your photo or video will appear in the gallery once reviewed.
        <br />
        <button
          className="btn btn--outline"
          style={{ marginTop: '1rem' }}
          onClick={() => setStatus('idle')}
        >
          Upload another
        </button>
      </div>
    )
  }

  const isWorking = status === 'uploading' || status === 'saving'

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.25rem' }}>
        Share a photo or video
      </h3>

      {(status === 'error' || errorMsg) && (
        <div className="form-error" role="alert" style={{ marginBottom: '1rem' }}>
          {errorMsg || 'Something went wrong. Please try again.'}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`upload-dropzone${dragging ? ' upload-dropzone--active' : ''}`}
        style={{ marginBottom: '1.25rem' }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Click or drag to choose a file"
      >
        <div className="upload-dropzone__icon">📷</div>
        {file ? (
          <p className="upload-dropzone__label">
            <span>{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(1)} MB)
          </p>
        ) : (
          <p className="upload-dropzone__label">
            <span>Click to choose</span> or drag a file here
            <br />
            <small>Images and video · Max 100 MB</small>
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {/* Progress bar (visible during upload) */}
      {status === 'uploading' && (
        <div className="progress-bar" style={{ marginBottom: '1.25rem' }}>
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="upload-name">Your name (optional)</label>
        <input
          id="upload-name"
          name="name"
          type="text"
          value={fields.name}
          onChange={handleChange}
          placeholder="e.g. Sarah"
          maxLength={100}
          autoComplete="name"
          disabled={isWorking}
        />
      </div>

      <div className="form-group">
        <label htmlFor="upload-caption">Caption (optional)</label>
        <textarea
          id="upload-caption"
          name="caption"
          rows={3}
          value={fields.caption}
          onChange={handleChange}
          placeholder="Describe the moment or add a short note…"
          maxLength={300}
          disabled={isWorking}
        />
      </div>

      <button
        type="submit"
        className="btn btn--primary"
        disabled={isWorking || !file}
      >
        {status === 'uploading' && `Uploading… ${progress}%`}
        {status === 'saving'    && 'Saving…'}
        {(status === 'idle' || status === 'error') && 'Upload'}
      </button>
    </form>
  )
}
