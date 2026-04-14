'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { analytics } from '@/lib/analytics'

type CalculatorInputs = {
  propertyPrice: number
  downPaymentPercent: number
  expectedMonthlyRent: number
  appreciationPercent: number
  mortgageRate: number
  includeMortgage: boolean
}

type ROIResult = {
  grossRentalYield: number
  netRentalYield: number
  annualROI: number
  monthlyNetCashFlow: number
  annualCashFlow: number
  totalInvestment: number
  equityAfter5Years: number
  totalReturnAfter5Years: number
  mortgagePayment?: number
}

function formatAED(n: number) {
  if (Math.abs(n) >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`
  return `AED ${n.toFixed(0)}`
}

const SLIDER_CONFIG = {
  propertyPrice: { min: 500_000, max: 20_000_000, step: 100_000, label: 'Property Price', format: formatAED },
  downPaymentPercent: { min: 20, max: 80, step: 5, label: 'Down Payment', format: (v: number) => `${v}%` },
  expectedMonthlyRent: { min: 2_000, max: 100_000, step: 500, label: 'Monthly Rent', format: formatAED },
  appreciationPercent: { min: 0, max: 15, step: 0.5, label: 'Annual Appreciation', format: (v: number) => `${v}%` },
}

export default function ROICalculator({ onLeadGate }: { onLeadGate?: (data: ROIResult) => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [results, setResults] = useState<ROIResult | null>(null)
  const [loading, setLoading] = useState(false)

  const { watch, setValue } = useForm<CalculatorInputs>({
    defaultValues: {
      propertyPrice: 1_500_000,
      downPaymentPercent: 25,
      expectedMonthlyRent: 8_000,
      appreciationPercent: 5,
      mortgageRate: 4.5,
      includeMortgage: true,
    },
  })
  const values = watch()

  const calculate = useCallback(async () => {
    setLoading(true)
    analytics.calculatorStarted()
    try {
      const res = await fetch('/api/roi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyPrice: values.propertyPrice,
          downPaymentPercent: values.downPaymentPercent,
          expectedMonthlyRent: values.expectedMonthlyRent,
          appreciationPercent: values.appreciationPercent,
          mortgageRate: values.includeMortgage ? values.mortgageRate : 0,
          mortgageTerm: 25,
        }),
      })
      const data: ROIResult = await res.json()
      setResults(data)
      setStep(2)
      analytics.calculatorCompleted({ propertyPrice: values.propertyPrice, rentalYield: data.grossRentalYield })
    } finally {
      setLoading(false)
    }
  }, [values])

  return (
    <section id="calculator" className="relative py-24 bg-surface-alt overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-violet-pale text-violet text-sm font-semibold mb-6">
            <span>⚡</span> Live ROI Calculator
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink mb-4 leading-tight">
            Calculate Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-brand-violet">
              Dubai Returns
            </span>
          </h2>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">
            Input your property details and instantly see rental yield, cash flow, and 5-year projections.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-surface-border shadow-card p-8"
          >
            <h3 className="text-xl font-bold text-ink mb-8">Property Details</h3>
            <div className="space-y-8">
              {(Object.keys(SLIDER_CONFIG) as Array<keyof typeof SLIDER_CONFIG>).map((key) => {
                const cfg = SLIDER_CONFIG[key]
                const val = values[key] as number
                const pct = ((val - cfg.min) / (cfg.max - cfg.min)) * 100
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-ink-muted text-sm font-medium">{cfg.label}</label>
                      <span className="text-ink font-bold text-lg">{cfg.format(val)}</span>
                    </div>
                    <input
                      type="range"
                      min={cfg.min} max={cfg.max} step={cfg.step} value={val}
                      onChange={(e) => setValue(key, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #7C3AED 0%, #123ba3 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-ink-faint mt-1">
                      <span>{cfg.format(cfg.min)}</span>
                      <span>{cfg.format(cfg.max)}</span>
                    </div>
                  </div>
                )
              })}

              {/* Mortgage Toggle */}
              <div className="border-t border-surface-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-ink-muted text-sm font-medium">Include Mortgage</label>
                  <button
                    type="button"
                    onClick={() => setValue('includeMortgage', !values.includeMortgage)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${values.includeMortgage ? 'bg-gradient-brand-violet' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${values.includeMortgage ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                {values.includeMortgage && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-ink-muted text-sm font-medium">Mortgage Rate</label>
                      <span className="text-ink font-bold">{values.mortgageRate}%</span>
                    </div>
                    <input
                      type="range" min={2} max={8} step={0.1} value={values.mortgageRate}
                      onChange={(e) => setValue('mortgageRate', parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #7C3AED 0%, #123ba3 ${((values.mortgageRate - 2) / 6) * 100}%, #E5E7EB ${((values.mortgageRate - 2) / 6) * 100}%, #E5E7EB 100%)`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={calculate}
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-brand-violet text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </span>
              ) : 'Calculate ROI Now →'}
            </button>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-surface-border shadow-card p-8 min-h-[500px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-2xl bg-violet-pale border border-violet/20 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-3">Your ROI Report</h3>
                  <p className="text-ink-muted mb-8 max-w-xs">Adjust the sliders and click "Calculate ROI Now" to see your full investment breakdown.</p>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {['Rental Yield', 'Annual ROI', 'Cash Flow', '5-Year Return'].map((item) => (
                      <div key={item} className="bg-surface-alt rounded-xl p-4 border border-surface-border">
                        <div className="h-6 bg-surface-border rounded animate-pulse mb-2" />
                        <div className="text-xs text-ink-faint">{item}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl border border-surface-border shadow-card p-8 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-ink">Your ROI Breakdown</h3>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-semibold border border-green-100">Live Results</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ResultCard label="Gross Rental Yield" value={`${results.grossRentalYield}%`} highlight="violet" sublabel="Annual gross" />
                    <ResultCard label="Net Rental Yield" value={`${results.netRentalYield}%`} highlight="brand" sublabel="After costs" />
                    <ResultCard label="Annual ROI" value={`${results.annualROI}%`} highlight="violet" sublabel="On invested capital" />
                    <ResultCard
                      label="Monthly Cash Flow"
                      value={formatAED(results.monthlyNetCashFlow)}
                      highlight={results.monthlyNetCashFlow > 0 ? 'green' : 'red'}
                      sublabel={results.monthlyNetCashFlow > 0 ? 'Positive flow' : 'Review costs'}
                    />
                  </div>

                  <div className="border-t border-surface-border pt-4 space-y-2.5">
                    {[
                      { label: 'Your Down Payment', value: formatAED(results.totalInvestment), color: 'text-ink' },
                      results.mortgagePayment ? { label: 'Monthly Mortgage', value: formatAED(results.mortgagePayment), color: 'text-ink' } : null,
                      { label: 'Annual Net Cash Flow', value: formatAED(results.annualCashFlow), color: results.annualCashFlow > 0 ? 'text-green-600' : 'text-red-500' },
                    ].filter(Boolean).map((row) => (
                      <div key={row!.label} className="flex justify-between text-sm">
                        <span className="text-ink-muted">{row!.label}</span>
                        <span className={`font-semibold ${row!.color}`}>{row!.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Locked 5-year projection */}
                  <div className="relative border border-violet/20 rounded-xl p-6 bg-violet-pale overflow-hidden">
                    <div className="blur-sm pointer-events-none select-none space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-muted">Equity After 5 Years</span>
                        <span className="text-ink font-semibold">{formatAED(results.equityAfter5Years)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-muted">Total 5-Year ROI</span>
                        <span className="text-green-600 font-bold text-lg">{results.totalReturnAfter5Years}%</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-violet-pale border border-violet/20 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-ink font-semibold text-sm mb-1">Unlock 5-Year Projections</p>
                      <p className="text-ink-muted text-xs mb-4 text-center">Free report with equity forecast & deal matches</p>
                      <button
                        onClick={() => onLeadGate?.(results)}
                        className="px-6 py-2.5 bg-gradient-brand-violet text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-violet hover:shadow-violet-lg"
                      >
                        Unlock Full Report →
                      </button>
                    </div>
                  </div>

                  <button onClick={() => setStep(1)} className="w-full py-2 text-ink-muted hover:text-ink text-sm transition-colors">← Recalculate</button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ResultCard({ label, value, highlight, sublabel }: { label: string; value: string; highlight?: string; sublabel?: string }) {
  const styles: Record<string, string> = {
    violet: 'bg-violet-pale border-violet/20',
    brand: 'bg-blue-50 border-brand/20',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
  }
  const text: Record<string, string> = {
    violet: 'text-violet',
    brand: 'text-brand',
    green: 'text-green-600',
    red: 'text-red-500',
  }
  return (
    <div className={`rounded-xl p-4 border ${styles[highlight || 'violet'] || styles.violet}`}>
      <div className={`text-2xl font-black mb-0.5 ${text[highlight || 'violet']}`}>{value}</div>
      <div className="text-xs text-ink-muted font-medium">{label}</div>
      {sublabel && <div className="text-xs text-ink-faint mt-0.5">{sublabel}</div>}
    </div>
  )
}
