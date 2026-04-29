import { useState } from 'react'
import UploadForm from '../components/UploadForm.jsx'
import UploadGallery from '../components/UploadGallery.jsx'

export default function Gallery() {
  // Incrementing this signal causes UploadGallery to re-fetch after a new upload.
  const [refreshSignal, setRefreshSignal] = useState(0)

  return (
    <div className="page-container">
      <h2 className="section-title">Gallery</h2>
      <p className="section-subtitle">
        Photos and video messages shared in Phil's memory.
      </p>

      <div className="two-col" style={{ marginBottom: '3rem' }}>
        <section>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            Upload a photo or video
          </h3>
          <UploadForm onUploaded={() => setRefreshSignal((n) => n + 1)} />
        </section>

        <section aria-live="polite">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            Shared moments
          </h3>
          <UploadGallery refreshSignal={refreshSignal} />
        </section>
      </div>
    </div>
  )
}
