'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LeadCapture from './LeadCapture'
import { analytics } from '@/lib/analytics'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const triggered = useRef(false)

  useEffect(() => {
    if (dismissed) return
    const timer = setTimeout(() => {
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 5 && !triggered.current) {
          triggered.current = true
          setShow(true)
          analytics.exitIntentShown()
        }
      }
      document.addEventListener('mouseleave', onLeave)
      return () => document.removeEventListener('mouseleave', onLeave)
    }, 8000)
    return () => clearTimeout(timer)
  }, [dismissed])

  const dismiss = () => { setShow(false); setDismissed(true) }
  const handleSuccess = (_score: string, url: string) => {
    analytics.exitIntentConverted(); setShow(false)
    if (url) setTimeout(() => window.open(url, '_blank'), 800)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={dismiss} className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[90]" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden pointer-events-auto shadow-violet-lg border border-surface-border-accent">
              <div className="relative bg-gradient-to-br from-violet to-brand p-8 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 0%, transparent 60%)' }} />
                <button onClick={dismiss} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xl transition-colors">×</button>
                <div className="relative">
                  <div className="text-4xl mb-3">🎁</div>
                  <h2 className="text-2xl font-black text-white mb-2">Wait! Don't Leave Empty-Handed</h2>
                  <p className="text-white/80 text-sm">Get your <strong>FREE Dubai Property Investment Guide</strong> — top 5 high-yield areas, off-plan payment plans, and ROI benchmarks.</p>
                </div>
              </div>
              <div className="p-8">
                <LeadCapture compact onSuccess={handleSuccess} />
                <div className="mt-4 text-center">
                  <button onClick={dismiss} className="text-ink-faint hover:text-ink-muted text-sm transition-colors">No thanks, I'll miss out on the free guide</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
