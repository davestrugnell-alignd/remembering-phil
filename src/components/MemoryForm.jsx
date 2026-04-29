import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

const INITIAL = { name: '', message: '' }

export default function MemoryForm() {
  const [fields, setFields] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'success' | 'error'

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fields.name.trim() || !fields.message.trim()) return

    setStatus('submitting')

    const { error } = await supabase.from('memories').insert({
      name: fields.name.trim(),
      message: fields.message.trim(),
    })

    if (error) {
      console.error('[MemoryForm]', error)
      setStatus('error')
      return
    }

    setStatus('success')
    setFields(INITIAL)
  }

  if (status === 'success') {
    return (
      <div className="form-confirmation" role="alert">
        Thank you for sharing your memory. It will appear on the wall once reviewed.
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.25rem' }}>
        Leave a memory
      </h3>

      {status === 'error' && (
        <div className="form-error" role="alert" style={{ marginBottom: '1rem' }}>
          Something went wrong. Please try again in a moment.
        </div>
      )}

      <div className="form-group">
        <label htmlFor="memory-name">Your name</label>
        <input
          id="memory-name"
          name="name"
          type="text"
          value={fields.name}
          onChange={handleChange}
          placeholder="e.g. Sarah"
          required
          maxLength={100}
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="memory-message">Your memory</label>
        <textarea
          id="memory-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={handleChange}
          placeholder="Share a memory, a story, or simply what Phil meant to you…"
          required
          maxLength={1000}
        />
        <span className="form-hint">{fields.message.length} / 1000</span>
      </div>

      <button
        type="submit"
        className="btn btn--primary"
        disabled={status === 'submitting' || !fields.name.trim() || !fields.message.trim()}
      >
        {status === 'submitting' ? 'Sharing…' : 'Share your memory'}
      </button>
    </form>
  )
}
