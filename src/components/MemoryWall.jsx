import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function MemoryWall() {
  const [memories, setMemories] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    async function fetchMemories() {
      const { data, error } = await supabase
        .from('memories')
        .select('id, name, message, created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('[MemoryWall]', error)
        setStatus('error')
        return
      }

      setMemories(data)
      setStatus('ready')
    }

    fetchMemories()
  }, [])

  if (status === 'loading') {
    return <p className="state-loading">Loading memories</p>
  }

  if (status === 'error') {
    return (
      <p className="form-error">
        We couldn't load the memories right now. Please try refreshing the page.
      </p>
    )
  }

  if (memories.length === 0) {
    return (
      <p className="state-empty">
        No memories have been shared yet. Be the first to leave a tribute below.
      </p>
    )
  }

  return (
    <div className="memory-wall">
      {memories.map((memory) => (
        <article key={memory.id} className="memory-card">
          <p className="memory-card__author">{memory.name}</p>
          <p className="memory-card__message">"{memory.message}"</p>
          <time className="memory-card__date" dateTime={memory.created_at}>
            {formatDate(memory.created_at)}
          </time>
        </article>
      ))}
    </div>
  )
}
