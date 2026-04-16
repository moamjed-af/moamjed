'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const testimonials = [
  { name: 'Khalid Al Mansoori', role: 'Investor from Abu Dhabi', flag: '🇦🇪', rating: 5, text: "Mo found me a 9.2% yielding apartment in Business Bay that I would have never discovered on my own. The ROI has been consistent for 2 years. Precision really does protect profit.", return: '9.2% yield', investment: 'AED 1.2M' },
  { name: 'James Worthington', role: 'Portfolio Investor, UK', flag: '🇬🇧', rating: 5, text: "As an overseas investor I was nervous about Dubai real estate. Mo's process was completely transparent. My portfolio is up 34% in 18 months. Exceptional service.", return: '+34% in 18 months', investment: 'AED 4.8M' },
  { name: 'Priya Sharma', role: 'First-time investor, India', flag: '🇮🇳', rating: 5, text: "I used the ROI calculator and was skeptical, but Mo delivered exactly what it promised. The Palm studio generates AED 8,500/month. Best financial decision I've made.", return: 'AED 8,500/month', investment: 'AED 950K' },
  { name: 'Ahmed Faris', role: 'Family Office Manager', flag: '🇸🇦', rating: 5, text: "We allocated AED 25M across 8 properties through Mo. Average yield is 7.9%. His market intelligence is unmatched. We reinvested within 6 months of completion.", return: '7.9% avg yield', investment: 'AED 25M' },
  { name: 'Marcus Becker', role: 'Tech Entrepreneur, Germany', flag: '🇩🇪', rating: 5, text: "Booked a call through the website at 11pm Dubai time, Mo responded within the hour. By the following week I had two off-plan deals under contract. Speed and precision.", return: '2 deals in 7 days', investment: 'AED 3.2M' },
]

const socialProof = [
  { value: '500+', label: 'Investors Served', color: 'violet' },
  { value: '30+', label: 'Countries', color: 'brand' },
  { value: '98%', label: 'Satisfaction Rate', color: 'violet' },
  { value: 'AED 1.2B+', label: 'Deals Closed', color: 'brand' },
]

export default function TrustSection() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="trust" ref={ref} className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow-violet opacity-15" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-violet-pale text-violet text-sm font-semibold mb-6">
            <span>⭐</span> Client Results
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-ink mb-4">
            Real Investors.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-brand-violet">Real Returns.</span>
          </h2>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">Over 500 investors across 30 countries trust Mo Amjed for precision Dubai property investment.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {socialProof.map((item) => (
            <div key={item.label} className={`rounded-xl p-6 text-center border ${item.color === 'violet' ? 'bg-violet-pale border-violet/20' : 'bg-blue-50 border-brand/20'}`}>
              <div className={`text-3xl font-black mb-1 ${item.color === 'violet' ? 'text-violet' : 'text-brand'}`}>{item.value}</div>
              <div className="text-ink-muted text-sm">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }}>
          <div className="bg-white rounded-2xl border border-surface-border-accent shadow-card-hover p-5 sm:p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-pale rounded-full translate-x-24 -translate-y-24" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -translate-x-16 translate-y-16" />

            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="relative">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="text-6xl font-serif leading-none mb-4 text-transparent bg-clip-text bg-gradient-brand-violet opacity-30">"</div>
                    <p className="text-ink text-base sm:text-xl lg:text-2xl font-medium leading-relaxed mb-6">{testimonials[active].text}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-60 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-violet-pale border border-violet/20 flex items-center justify-center text-2xl">{testimonials[active].flag}</div>
                      <div>
                        <div className="text-ink font-bold">{testimonials[active].name}</div>
                        <div className="text-ink-muted text-sm">{testimonials[active].role}</div>
                      </div>
                    </div>
                    <div className="bg-surface-alt rounded-xl p-4 border border-surface-border space-y-3">
                      <div><div className="text-xs text-ink-faint mb-0.5">Investment</div><div className="text-ink font-bold">{testimonials[active].investment}</div></div>
                      <div className="h-px bg-surface-border" />
                      <div><div className="text-xs text-ink-faint mb-0.5">Return</div><div className="text-green-600 font-bold">{testimonials[active].return}</div></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-border">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-gradient-brand-violet' : 'w-2 bg-surface-border hover:bg-violet/30'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 rounded-xl border border-surface-border hover:border-surface-border-accent text-ink-muted hover:text-ink flex items-center justify-center transition-all">←</button>
                <button onClick={() => setActive((a) => (a + 1) % testimonials.length)} className="w-10 h-10 rounded-xl border border-surface-border hover:border-surface-border-accent text-ink-muted hover:text-ink flex items-center justify-center transition-all">→</button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
