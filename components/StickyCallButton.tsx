'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { analytics } from '@/lib/analytics'

export default function StickyCallButton() {
  const [scrolled, setScrolled] = useState(false)
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/mo-amjed/strategy-call'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed bottom-6 left-6 z-50">
          <a
            href={calendlyUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => analytics.calendlyOpened()}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-brand-violet text-white rounded-full font-semibold text-sm shadow-violet hover:shadow-violet-lg transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Book a Call
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
