// Client-side email notifications via EmailJS — works on static/GitHub Pages hosting

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const NOTIFICATION_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID || ''
const THANKYOU_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_THANKYOU_TEMPLATE_ID || ''
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
const NOTIFICATION_EMAIL = process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL || 'moamjed66@gmail.com'

export const emailConfigured = () =>
  !!(SERVICE_ID && NOTIFICATION_TEMPLATE_ID && PUBLIC_KEY)

const BUDGET_LABELS: Record<string, string> = {
  'under-500k': 'Under AED 500,000',
  '500k-1m':    'AED 500,000 – 1,000,000',
  '1m-2m':      'AED 1,000,000 – 2,000,000',
  '2m-5m':      'AED 2,000,000 – 5,000,000',
  '5m-plus':    'AED 5,000,000+',
}

const TIMELINE_LABELS: Record<string, string> = {
  'immediately':    'Ready to invest immediately',
  '1-3-months':     'Within 1–3 months',
  '3-6-months':     'Within 3–6 months',
  '6-12-months':    'Within 6–12 months',
  '12-plus-months': 'More than 12 months',
}

const SCORE_LABELS: Record<string, string> = {
  'HIGH':   '🔥 HIGH PRIORITY',
  'MEDIUM': '⚡ MEDIUM PRIORITY',
  'LOW':    '📩 NURTURE',
}

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

  return send(
    SERVICE_ID,
    NOTIFICATION_TEMPLATE_ID,
    {
      to_email:      NOTIFICATION_EMAIL,
      to_name:       'Mo',
      client_name:   params.name,
      client_phone:  `+971${params.phone.replace(/\D/g, '')}`,
      client_email:  params.email || 'Not provided',
      budget:        BUDGET_LABELS[params.budget_range] || params.budget_range,
      timeline:      TIMELINE_LABELS[params.buying_timeline] || params.buying_timeline,
      score:         SCORE_LABELS[params.score] || params.score,
      whatsapp_link: `https://wa.me/971${params.phone.replace(/^0/, '').replace(/\D/g, '')}`,
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
      to_name:       params.name,
      to_email:      params.email,
      budget:        BUDGET_LABELS[params.budget_range] || params.budget_range,
      timeline:      TIMELINE_LABELS[params.buying_timeline] || params.buying_timeline,
      whatsapp_link: 'https://wa.me/971544245800',
    },
    PUBLIC_KEY
  )
}
