// Client-side email via EmailJS — works on GitHub Pages (no server needed)
// Sign up free at emailjs.com → get Service ID, Template IDs, and Public Key
// Free tier: 200 emails/month

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const NOTIFICATION_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID || ''
const THANKYOU_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_THANKYOU_TEMPLATE_ID || ''
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

export const emailConfigured = () =>
  !!(SERVICE_ID && NOTIFICATION_TEMPLATE_ID && PUBLIC_KEY)

export async function sendLeadNotification(params: {
  name: string
  phone: string
  email?: string
  budget_range: string
  buying_timeline: string
  score: string
}) {
  if (!emailConfigured()) return
  const { send } = await import('@emailjs/browser')
  const scoreEmoji = params.score === 'HIGH' ? '🔥' : params.score === 'MEDIUM' ? '⚡' : '📬'
  return send(
    SERVICE_ID,
    NOTIFICATION_TEMPLATE_ID,
    {
      to_name: 'Mo',
      to_email: process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL || 'mo@moamjed.com',
      from_name: params.name,
      client_name: params.name,
      client_phone: params.phone,
      client_email: params.email || 'Not provided',
      budget: params.budget_range,
      timeline: params.buying_timeline,
      score: `${scoreEmoji} ${params.score}`,
      whatsapp_link: `https://wa.me/${params.phone.replace(/\D/g, '')}`,
    },
    PUBLIC_KEY
  )
}

export async function sendThankYouEmail(params: {
  name: string
  email: string
  budget_range: string
  buying_timeline: string
  score: string
}) {
  if (!emailConfigured() || !THANKYOU_TEMPLATE_ID || !params.email) return
  const { send } = await import('@emailjs/browser')
  return send(
    SERVICE_ID,
    THANKYOU_TEMPLATE_ID,
    {
      to_name: params.name,
      to_email: params.email,
      budget: params.budget_range,
      timeline: params.buying_timeline,
      whatsapp_link: 'https://wa.me/971544245800',
    },
    PUBLIC_KEY
  )
}
