'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { analytics } from '@/lib/analytics'

export default function BookCall() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/mo-amjed/strategy-call'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971544245800'

  return (
    <section id="book-call" ref={ref} className="relative py-24 bg-surface-alt overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-violet-pale text-violet text-sm font-semibold mb-6">
              <span>📅</span> Strategy Session
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-ink mb-6 leading-tight">
              Book Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-brand-violet">Free 30-Min</span>{' '}
              Strategy Call
            </h2>
            <p className="text-ink-muted text-lg mb-8 leading-relaxed">In 30 minutes, Mo maps out your exact Dubai property investment path — which areas, which developers, and realistic returns for your budget.</p>
            <div className="space-y-3 mb-8">
              {['Your personal ROI roadmap for Dubai real estate', 'Off-market deals matched to your exact budget', 'Developer payment plan options explained', 'UAE Golden Visa eligibility & residency benefits', 'Tax-free income strategies'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-brand-violet flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-ink-body text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-surface-border-accent rounded-xl p-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
              <p className="text-ink-body text-sm"><span className="text-ink font-semibold">Limited slots available.</span>{' '}Mo takes a maximum of 5 strategy calls per week.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-4">
            <div className="bg-white border border-surface-border-accent rounded-2xl overflow-hidden shadow-card">
              <div className="p-6 border-b border-surface-border">
                <h3 className="text-ink font-bold text-lg">Pick a Time That Works for You</h3>
                <p className="text-ink-muted text-sm mt-1">All times shown in your local timezone</p>
              </div>
              <iframe
                src={`${calendlyUrl}?embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=1E1B4B&primary_color=7C3AED`}
                width="100%" height="500" frameBorder="0"
                title="Schedule a call with Mo Amjed"
                className="block min-h-[400px] sm:min-h-[500px]"
                style={{ height: '500px' }}
                onLoad={() => analytics.calendlyOpened()}
              />
            </div>
            <div className="bg-white border border-surface-border rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="text-ink font-semibold text-sm mb-0.5">Prefer to chat first?</div>
                <div className="text-ink-muted text-xs">Message Mo directly on WhatsApp</div>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Mo, I'd like to book a strategy call about Dubai property investment.")}`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => analytics.whatsappClicked('book_call_section')}
                className="flex items-center gap-2 px-4 py-3 min-h-[44px] bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors duration-200 flex-shrink-0"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
