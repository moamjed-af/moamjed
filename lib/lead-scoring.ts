export type LeadScore = 'HIGH' | 'MEDIUM' | 'LOW'

export type LeadData = {
  budget_range: string
  buying_timeline: string
}

const BUDGET_VALUES: Record<string, number> = {
  'under-500k': 400000,
  '500k-1m': 750000,
  '1m-2m': 1500000,
  '2m-5m': 3500000,
  '5m-plus': 6000000,
}

const TIMELINE_MONTHS: Record<string, number> = {
  'immediately': 0,
  '1-3-months': 2,
  '3-6-months': 4,
  '6-12-months': 9,
  '12-plus-months': 18,
}

export function scoreLead(data: LeadData): LeadScore {
  const budget = BUDGET_VALUES[data.budget_range] ?? 0
  const months = TIMELINE_MONTHS[data.buying_timeline] ?? 99

  if (budget >= 1_000_000 && months <= 3) return 'HIGH'
  if (budget >= 500_000 || months <= 6) return 'MEDIUM'
  return 'LOW'
}

export function getRedirectUrl(score: LeadScore, leadData?: LeadData & { name?: string; goal?: string }): string {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/mo-amjed/strategy-call'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971544245800'

  const budget = leadData?.budget_range?.replace(/-/g, ' ').replace('k', 'K').replace('m', 'M') || 'N/A'
  const timeline = leadData?.buying_timeline?.replace(/-/g, ' ') || 'N/A'

  const whatsappMessage = encodeURIComponent(
    `Hi Mo, I just used your ROI Calculator:\n• Budget: AED ${budget}\n• Timeline: ${timeline}\n\nI want to see available Dubai properties.`
  )

  switch (score) {
    case 'HIGH':
      return calendlyUrl
    case 'MEDIUM':
      return `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    case 'LOW':
      return '/dubai-investment-guide'
  }
}

export const BUDGET_OPTIONS = [
  { value: 'under-500k', label: 'Under AED 500K' },
  { value: '500k-1m', label: 'AED 500K – 1M' },
  { value: '1m-2m', label: 'AED 1M – 2M' },
  { value: '2m-5m', label: 'AED 2M – 5M' },
  { value: '5m-plus', label: 'AED 5M+' },
]

export const TIMELINE_OPTIONS = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1-3-months', label: 'Within 1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: '6-12-months', label: '6–12 months' },
  { value: '12-plus-months', label: '12+ months' },
]
