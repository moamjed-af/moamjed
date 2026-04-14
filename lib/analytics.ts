declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export const analytics = {
  calculatorStarted: () =>
    trackEvent('calculator_started', 'ROI Calculator'),

  calculatorCompleted: (data: { propertyPrice: number; rentalYield: number }) =>
    trackEvent('calculator_completed', 'ROI Calculator', `yield_${data.rentalYield.toFixed(1)}%`, data.propertyPrice),

  leadSubmitted: (score: string) =>
    trackEvent('lead_submitted', 'Lead Capture', score),

  whatsappClicked: (source: string) =>
    trackEvent('whatsapp_click', 'CTA', source),

  calendlyOpened: () =>
    trackEvent('calendly_opened', 'CTA', 'book_call'),

  exitIntentShown: () =>
    trackEvent('exit_intent_shown', 'Engagement'),

  exitIntentConverted: () =>
    trackEvent('exit_intent_converted', 'Lead Capture'),

  propertyViewed: (propertyName: string) =>
    trackEvent('property_viewed', 'Properties', propertyName),

  ctaClicked: (ctaName: string, section: string) =>
    trackEvent('cta_clicked', section, ctaName),
}
