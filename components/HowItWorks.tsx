'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  { step: '01', icon: '📞', title: 'Discovery Call', desc: 'A focused 20-minute strategy session to understand your investment goals, budget, and timeline — the foundation every recommendation is built on.', color: 'violet' },
  { step: '02', icon: '🎯', title: 'Bespoke Strategy', desc: 'A curated shortlist of properties — including off-market opportunities — matched precisely to your yield targets, risk profile, and capital.', color: 'brand' },
  { step: '03', icon: '🏙️', title: 'Validated Shortlist', desc: 'Every option is toured, stress-tested, and independently verified — DLD checks, developer vetting, and ROI analysis included — before it reaches you.', color: 'violet' },
  { step: '04', icon: '🔑', title: 'End-to-End Execution', desc: 'Full-service closing: negotiations, legal checks, and DLD registration handled from start to finish. You sign, collect keys, and start earning.', color: 'brand' },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow-brand opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/20 bg-blue-50 text-brand text-sm font-semibold mb-6">
            <span>📞</span> The Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-ink mb-4">
            From First Call to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-brand-violet">First Cheque</span>
          </h2>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">A fully managed investment service — from initial consultation to completed transaction, every step is handled on your behalf.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-surface-border-accent to-transparent z-0 -translate-y-px" />
              )}
              <div className={`relative bg-white rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${step.color === 'violet' ? 'border-violet/20 hover:border-violet/40' : 'border-brand/20 hover:border-brand/40'}`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4 ${step.color === 'violet' ? 'bg-violet-pale' : 'bg-blue-50'}`}>
                  {step.icon}
                </div>
                <div className={`text-xs font-black tracking-widest mb-2 ${step.color === 'violet' ? 'text-violet' : 'text-brand'}`}>STEP {step.step}</div>
                <h3 className="text-ink font-bold text-lg mb-2 leading-tight">{step.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }} className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-brand-violet text-white rounded-2xl font-bold text-lg shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Your Discovery Call
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
