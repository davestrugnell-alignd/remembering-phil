import { useState, useEffect, useRef } from 'react'

const MUSIC_SRC = import.meta.env.VITE_MUSIC_URL || null

// Inline SVG icons — no icon library needed
function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}
function IconVolume() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  )
}
function IconMuted() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}

export default function AudioPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!MUSIC_SRC) return
    const audio = audioRef.current
    // Muted autoplay is permitted by all browsers.
    // The user can unmute once they choose to.
    audio.muted = true
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay was blocked entirely — user must press play first.
      })
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying((p) => !p)
  }

  function toggleMute() {
    const audio = audioRef.current
    const unmuting = muted
    audio.muted = !muted
    setMuted((m) => !m)
    // If autoplay was blocked, unmuting should also kick off playback
    if (unmuting && !playing) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  if (!MUSIC_SRC) return null

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
      <div className="audio-player" role="region" aria-label="Background music controls">
        <span className="audio-player__label">♩</span>
        <button
          className="audio-player__btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause music' : 'Play music'}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>
        <button
          className="audio-player__btn audio-player__btn--mute"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          title={muted ? 'Unmute' : 'Mute'}
          data-muted={muted}
        >
          {muted ? <IconMuted /> : <IconVolume />}
        </button>
        {muted && (
          <span className="audio-player__hint">
            {playing ? 'tap to unmute' : 'tap to play'}
          </span>
        )}
      </div>
    </>
  )
}
