'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '100+', label: 'Investors Helped', color: 'violet' },
  { value: '30+', label: 'Nationalities', color: 'brand' },
  { value: '98%', label: 'Satisfaction Rate', color: 'violet' },
  { value: '1', label: 'City. Dubai.', color: 'brand' },
]

export default function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="relative py-14 bg-white border-y border-surface-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow-violet opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`text-center rounded-2xl border p-6 ${
                s.color === 'violet'
                  ? 'bg-violet-pale/40 border-violet/20'
                  : 'bg-brand/5 border-brand/20'
              }`}
            >
              <div className={`text-3xl sm:text-4xl font-black mb-1 ${
                s.color === 'violet' ? 'text-violet' : 'text-brand'
              }`}>
                {s.value}
              </div>
              <div className="text-ink-muted text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
