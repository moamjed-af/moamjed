'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 500, suffix: '+', label: 'Investors Served', prefix: '', color: 'brand' },
  { value: 1.2, suffix: 'B+', label: 'AED Managed', prefix: 'AED ', color: 'violet' },
  { value: 8.5, suffix: '%', label: 'Avg Rental Yield', prefix: '', color: 'brand' },
  { value: 7, suffix: '+', label: 'Years in Dubai', prefix: '', color: 'violet' },
]

function CountUp({ target, prefix, suffix }: { target: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(parseFloat(current.toFixed(1)))
    }, 2000 / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{prefix}{count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}{suffix}</span>
}

export default function StatsBar() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="relative py-14 bg-white border-y border-surface-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow-violet opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 transition-colors duration-300 ${
                stat.color === 'violet' ? 'text-violet group-hover:text-violet-dark' : 'text-brand group-hover:text-brand-dark'
              }`}>
                <CountUp target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-sm sm:text-base text-ink-muted font-medium">{stat.label}</div>
              <div className={`mt-3 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                stat.color === 'violet' ? 'bg-gradient-violet' : 'bg-gradient-brand'
              }`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
