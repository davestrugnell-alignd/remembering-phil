import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

function withoutTransform(url) {
  return url.replace(/\/upload\/[^/]+\//, '/upload/')
}

export default function UploadGallery({ refreshSignal }) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [lightbox, setLightbox] = useState(null)

  const fetchUploads = useCallback(async () => {
    setStatus('loading')
    const { data, error } = await supabase
      .from('media_uploads')
      .select('id, name, caption, cloudinary_url, resource_type, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[UploadGallery]', error)
      setStatus('error')
      return
    }

    setItems(data)
    setStatus('ready')
  }, [])

  useEffect(() => {
    fetchUploads()
  }, [fetchUploads, refreshSignal])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  if (status === 'loading') {
    return <p className="state-loading">Loading gallery</p>
  }

  if (status === 'error') {
    return (
      <p className="form-error">
        We couldn't load the gallery right now. Please try refreshing the page.
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <p className="state-empty">
        No photos or videos have been shared yet. Be the first to upload one.
      </p>
    )
  }

  return (
    <>
      <div className="upload-gallery">
        {items.map((item) => (
          <div
            key={item.id}
            className={`gallery-item${item.resource_type === 'image' ? ' gallery-item--clickable' : ''}`}
            onClick={() => item.resource_type === 'image' && setLightbox(item)}
          >
            {item.resource_type === 'video' ? (
              <video src={item.cloudinary_url} controls preload="metadata" />
            ) : (
              <img
                src={item.cloudinary_url}
                alt={item.caption ?? `Shared by ${item.name ?? 'a visitor'}`}
                loading="lazy"
              />
            )}
            {(item.name || item.caption) && (
              <div className="gallery-item__caption">
                {item.name && <strong>{item.name}</strong>}
                {item.name && item.caption && ' — '}
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img
              src={withoutTransform(lightbox.cloudinary_url)}
              alt={lightbox.caption ?? `Shared by ${lightbox.name ?? 'a visitor'}`}
            />
            {(lightbox.name || lightbox.caption) && (
              <div className="lightbox__caption">
                {lightbox.name && <strong>{lightbox.name}</strong>}
                {lightbox.name && lightbox.caption && ' — '}
                {lightbox.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
