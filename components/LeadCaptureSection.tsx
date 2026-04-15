'use client'

import { motion } from 'framer-motion'
import LeadCapture from './LeadCapture'

export default function LeadCaptureSection() {
  const handleSuccess = (_score: string, url: string) => {
    if (url) setTimeout(() => window.open(url, '_blank'), 500)
  }

  return (
    <section id="lead-capture" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow-violet opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-violet-pale text-violet text-sm font-semibold mb-6">
              <span>🎯</span> Free Property Report
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-ink mb-6 leading-tight">
              Get Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-brand-violet">Custom Dubai</span>{' '}
              Investment Plan
            </h2>
            <div className="space-y-5 mb-8">
              {[
                { icon: '📊', title: 'Personalized ROI Analysis', desc: 'Based on your budget and goals, we identify properties matching your return targets.' },
                { icon: '🏙️', title: 'Off-Market Deals Access', desc: 'Exclusive access to properties not listed publicly — developer direct pricing.' },
                { icon: '⚡', title: '2-Hour Response Guarantee', desc: 'A senior investment specialist contacts you within 2 hours of submitting.' },
                { icon: '🔒', title: 'Zero Pressure, Full Confidentiality', desc: 'No hard selling. Your details are never shared. 100% private consultation.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-pale border border-violet/20 flex items-center justify-center flex-shrink-0 text-lg">{item.icon}</div>
                  <div>
                    <div className="text-ink font-semibold mb-0.5">{item.title}</div>
                    <div className="text-ink-muted text-sm leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-surface-alt border border-surface-border-accent rounded-xl p-5">
              <p className="text-ink-body text-sm leading-relaxed">
                <span className="text-ink font-semibold">How it works: </span>
                Based on your budget and timeline, we immediately route you to a{' '}
                <span className="text-violet font-semibold">strategy call</span> for high-priority investors or a{' '}
                <span className="text-green-600 font-semibold">WhatsApp consultation</span> for everyone else.
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl border border-surface-border-accent shadow-card-hover p-5 sm:p-8">
            <LeadCapture onSuccess={handleSuccess} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
