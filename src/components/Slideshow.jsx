import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const SLIDE_DURATION_MS = 6000

export default function Slideshow() {
  const [photos, setPhotos] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('slideshow_photos')
        .select('id, cloudinary_url')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (!error && data?.length) setPhotos(data)
    }
    fetchPhotos()
  }, [])

  useEffect(() => {
    if (photos.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(timer)
  }, [photos.length])

  if (photos.length === 0) return null

  return (
    <div className="slideshow">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className={`slideshow__slide${i === current ? ' slideshow__slide--active' : ''}`}
        >
          <img src={photo.cloudinary_url} alt="" role="presentation" />
        </div>
      ))}
    </div>
  )
}
