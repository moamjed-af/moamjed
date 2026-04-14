'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setTimeout(() => setShow(true), 2500)
  }, [])

  const accept = () => { localStorage.setItem('cookie-consent', 'accepted'); setShow(false) }
  const decline = () => { localStorage.setItem('cookie-consent', 'declined'); setShow(false) }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[80] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white border border-surface-border-accent rounded-2xl shadow-violet-lg p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-2xl flex-shrink-0">🍪</div>
            <div className="flex-1 min-w-0">
              <p className="text-ink font-semibold text-sm mb-1">We use cookies</p>
              <p className="text-ink-muted text-xs leading-relaxed">
                We use cookies to improve your experience, analyze site traffic, and serve personalised content.
                By clicking "Accept", you consent to our use of cookies.{' '}
                <Link href="/privacy-policy" className="text-violet hover:underline">Privacy Policy</Link>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-ink border border-surface-border rounded-xl transition-colors duration-200"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-brand-violet rounded-xl shadow-violet-sm hover:shadow-violet transition-all duration-200"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
