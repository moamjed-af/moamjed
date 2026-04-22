'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import HowItWorks from '@/components/HowItWorks'
import ROICalculator from '@/components/ROICalculator'
import LeadCaptureSection from '@/components/LeadCaptureSection'
import TrustSection from '@/components/TrustSection'
import BookCall from '@/components/BookCall'
import WhatsAppButton from '@/components/WhatsAppButton'
import StickyCallButton from '@/components/StickyCallButton'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import CookieBanner from '@/components/CookieBanner'
import Footer from '@/components/Footer'
import LeadCapture from '@/components/LeadCapture'
import type { ROIResult } from '@/lib/roi-calc'

export default function HomePage() {
  const [roiData, setRoiData] = useState<ROIResult | null>(null)
  const [showLeadModal, setShowLeadModal] = useState(false)

  const handleLeadGate = (data: ROIResult) => {
    setRoiData(data)
    setShowLeadModal(true)
  }

  const handleLeadSuccess = (_score: string, redirectUrl: string) => {
    setShowLeadModal(false)
    if (redirectUrl) setTimeout(() => window.open(redirectUrl, '_blank'), 600)
  }

  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero — 3D Purple Twilight Cityscape */}
        <Hero />

        {/* 2. Stats */}
        <StatsBar />

        {/* 3. How It Works — ADDED */}
        <HowItWorks />

        {/* 4. ROI Calculator */}
        <ROICalculator onLeadGate={handleLeadGate} />

        {/* 5. Lead Capture */}
        <LeadCaptureSection />

        {/* 7. Testimonials */}
        <TrustSection />

        {/* 8. Book a Call */}
        <BookCall />
      </main>

      <Footer />

      {/* Floating Elements */}
      <WhatsAppButton />
      <StickyCallButton />
      <ExitIntentPopup />
      <CookieBanner />

      {/* ROI Unlock Modal */}
      <AnimatePresence>
        {showLeadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLeadModal(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-white border border-surface-border-accent rounded-2xl p-8 pointer-events-auto shadow-violet-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-ink">Unlock Your Full Report</h3>
                    <p className="text-ink-muted text-sm mt-1">Get your 5-year projection + personalised deal list</p>
                  </div>
                  <button onClick={() => setShowLeadModal(false)} className="w-8 h-8 rounded-full border border-surface-border text-ink-muted hover:text-ink flex items-center justify-center text-xl transition-colors">×</button>
                </div>
                {roiData && (
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-surface-alt rounded-xl border border-surface-border">
                    <div><div className="text-violet font-black text-xl">{roiData.grossRentalYield}%</div><div className="text-ink-faint text-xs">Gross Yield</div></div>
                    <div><div className="text-brand font-black text-xl">{roiData.irr5Year}%</div><div className="text-ink-faint text-xs">IRR (5-Year)</div></div>
                  </div>
                )}
                <LeadCapture compact prefilledData={roiData || undefined} onSuccess={handleLeadSuccess} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
