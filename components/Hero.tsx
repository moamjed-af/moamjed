'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { analytics } from '@/lib/analytics'

const Hero3DScene = dynamic(() => import('./Hero3DScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: '#1E0A3C' }} />,
})

export default function Hero() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971544245800'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Hero3DScene />
      </div>

      {/* Gradient overlay — fades hero into white at bottom */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-white" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-hero/50 via-transparent to-hero/50" />

      {/* Center glow */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-violet/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-soft/40 bg-white/10 backdrop-blur-sm text-violet-soft text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-violet-soft animate-pulse-slow" />
          Dubai's #1 ROI-Focused Property Broker
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
        >
          Find{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-soft to-violet-light">
            High-ROI
          </span>
          <br />
          Dubai Properties
          <br />
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white/70">
            in 60 Seconds
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Use our AI-powered ROI calculator to discover your potential returns instantly.
          Trusted by{' '}
          <span className="text-white font-semibold">500+ investors</span>{' '}
          across 30 countries.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#calculator"
            onClick={() => analytics.ctaClicked('calculate_roi', 'hero')}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-brand-violet text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-violet-lg hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(124,58,237,0.45)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <CalculatorIcon className="w-5 h-5" />
              Calculate My ROI
            </span>
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Mo, I'm interested in Dubai property investment. Can we connect?")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.whatsappClicked('hero')}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              <WhatsAppIcon className="w-5 h-5 text-green-400" />
              Talk on WhatsApp
            </span>
          </a>
        </motion.div>

        {/* Trust chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/50"
        >
          {[
            { icon: '🏆', text: 'Top 1% Dubai Broker' },
            { icon: '⚡', text: '60-Second ROI Analysis' },
            { icon: '🔒', text: '100% Confidential' },
            { icon: '🌍', text: '30+ Countries Served' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-0.5 h-8 bg-gradient-to-b from-violet to-transparent rounded-full"
        />
      </motion.div>
    </section>
  )
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
