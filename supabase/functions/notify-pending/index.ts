import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const NOTIFY_EMAIL = 'dave@alignd.co.za'
const SUPABASE_DASHBOARD_URL =
  'https://supabase.com/dashboard/project/nydwmoelkumscrwsbxeu'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = await req.json()
  const record = payload.record

  const isMedia = payload.table === 'media_uploads'
  const subject = isMedia
    ? `New photo/video needs approval – Remembering Phil`
    : `New memory needs approval – Remembering Phil`

  const who = record.name ?? 'Someone'
  const details = isMedia
    ? `<p><strong>Uploaded by:</strong> ${who}</p>
       <p><strong>Type:</strong> ${record.resource_type}</p>
       ${record.caption ? `<p><strong>Caption:</strong> ${record.caption}</p>` : ''}
       <p><strong>URL:</strong> <a href="${record.cloudinary_url}">${record.cloudinary_url}</a></p>`
    : `<p><strong>From:</strong> ${who}</p>
       <p><strong>Message:</strong> ${record.message}</p>`

  const tableLabel = isMedia ? 'media_uploads' : 'memories'
  const approveUrl = `${SUPABASE_DASHBOARD_URL}/editor?filter=id%3Deq.${record.id}&schema=public&table=${tableLabel}`

  const html = `
    <h2>${isMedia ? '📷 New upload' : '💬 New memory'} awaiting approval</h2>
    ${details}
    <p style="margin-top:24px">
      <a href="${approveUrl}" style="background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-family:sans-serif">
        Review in Supabase →
      </a>
    </p>
    <p style="color:#888;font-size:12px;margin-top:32px">Remembering Phil memorial site</p>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Remembering Phil <onboarding@resend.dev>',
      to: NOTIFY_EMAIL,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error('Resend error:', error)
    return new Response(error, { status: 500 })
  }

  return new Response('ok', { status: 200 })
})
