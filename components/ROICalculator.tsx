'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { analytics } from '@/lib/analytics'
import { calculateROI, type ROIResult } from '@/lib/roi-calc'

type Inputs = {
  propertyPrice: number
  downPaymentPercent: number
  expectedAnnualRent: number
  appreciationPercent: number
  serviceChargePerSqft: number
  mortgageRate: number
  includeMortgage: boolean
  includeCommission: boolean
  includeDLD: boolean
  propertySizeSqft: number
}

function fAED(n: number) {
  if (Math.abs(n) >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000)     return `AED ${(n / 1_000).toFixed(0)}K`
  return `AED ${Math.round(n).toLocaleString()}`
}
function fPct(n: number, decimals = 1) { return `${n.toFixed(decimals)}%` }
function fNum(n: number) { return n.toLocaleString() }

const SLIDERS = [
  { key: 'downPaymentPercent',  min: 20,       max: 80,          step: 5,      label: 'Down Payment',            fmt: (v: number) => `${v}%` },
  { key: 'appreciationPercent', min: 0,        max: 15,          step: 0.5,    label: 'Annual Capital Growth',   fmt: (v: number) => `${v}%` },
] as const

function MoneyInput({ label, value, onChange, placeholder, hint }: {
  label: string
  value: number
  onChange: (v: number) => void
  placeholder?: string
  hint?: string
}) {
  const format = (n: number) => n > 0 ? n.toLocaleString('en-US') : ''
  const [display, setDisplay] = useState(format(value))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '').replace(/[^0-9]/g, '')
    const num = raw ? parseInt(raw, 10) : 0
    setDisplay(num > 0 ? num.toLocaleString('en-US') : '')
    onChange(num)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-ink-muted text-sm font-medium">{label}</label>
        <span className="text-ink font-bold">{value > 0 ? fAED(value) : '—'}</span>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-sm font-medium pointer-events-none">AED</span>
        <input
          type="text" inputMode="numeric"
          value={display}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full border border-surface-border rounded-xl pl-14 pr-4 py-2.5 text-sm text-ink bg-surface-alt outline-none focus:border-violet transition-colors"
        />
      </div>
      {hint && <p className="text-xs text-ink-faint mt-1">{hint}</p>}
    </div>
  )
}

function Slider({ cfg, value, onChange }: {
  cfg: typeof SLIDERS[number]
  value: number
  onChange: (v: number) => void
}) {
  const pct = ((value - cfg.min) / (cfg.max - cfg.min)) * 100
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-ink-muted text-sm font-medium">{cfg.label}</label>
        <span className="text-ink font-bold">{cfg.fmt(value)}</span>
      </div>
      <input
        type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer touch-none"
        style={{ background: `linear-gradient(to right,#7C3AED 0%,#123ba3 ${pct}%,#E5E7EB ${pct}%,#E5E7EB 100%)` }}
      />
      <div className="flex justify-between text-xs text-ink-faint mt-1">
        <span>{cfg.fmt(cfg.min)}</span><span>{cfg.fmt(cfg.max)}</span>
      </div>
    </div>
  )
}

function Toggle({ on, onToggle, label, sub }: { on: boolean; onToggle: () => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-ink-muted text-sm font-medium">{label}</div>
        {sub && <div className="text-ink-faint text-xs mt-0.5">{sub}</div>}
      </div>
      <button type="button" onClick={onToggle}
        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-300 ${on ? 'bg-gradient-brand-violet' : 'bg-gray-200'}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

const DEMAND_STYLE = {
  High:   { bg: 'bg-green-50 border-green-200',  text: 'text-green-700',  dot: 'bg-green-500' },
  Medium: { bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  Low:    { bg: 'bg-red-50 border-red-200',       text: 'text-red-700',    dot: 'bg-red-500' },
}

function Metric({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
      <div>
        <div className="text-sm text-ink-muted">{label}</div>
        {sub && <div className="text-xs text-ink-faint">{sub}</div>}
      </div>
      <div className={`text-sm font-bold text-right ${accent || 'text-ink'}`}>{value}</div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-alt rounded-xl border border-surface-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-bold text-ink">{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function ROICalculator({ onLeadGate }: { onLeadGate?: (data: ROIResult) => void }) {
  const [results, setResults] = useState<ROIResult | null>(null)
  const [loading, setLoading] = useState(false)

  const { watch, setValue } = useForm<Inputs>({
    defaultValues: {
      propertyPrice:       1_500_000,
      downPaymentPercent:  25,
      expectedAnnualRent:   96_000,
      appreciationPercent:  5,
      serviceChargePerSqft: 0,
      mortgageRate:        4.5,
      includeMortgage:     true,
      includeCommission:   false,
      includeDLD:          false,
      propertySizeSqft:    0,
    },
  })
  const v = watch()

  const calculate = useCallback(() => {
    setLoading(true)
    analytics.calculatorStarted()
    try {
      const data = calculateROI({
        propertyPrice:        v.propertyPrice,
        downPaymentPercent:   v.downPaymentPercent,
        expectedMonthlyRent:  v.expectedAnnualRent / 12,
        appreciationPercent:  v.appreciationPercent,
        mortgageRate:         v.includeMortgage ? v.mortgageRate : 0,
        mortgageTerm:         25,
        includeCommission:    v.includeCommission,
        propertySizeSqft:     v.propertySizeSqft,
        serviceChargePerSqft: v.serviceChargePerSqft,
        includeDLD:           v.includeDLD,
      })
      setResults(data)
      analytics.calculatorCompleted({ propertyPrice: v.propertyPrice, rentalYield: data.grossRentalYield })
    } finally {
      setLoading(false)
    }
  }, [v])

  return (
    <section id="calculator" className="relative py-24 bg-surface-alt overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-violet-pale text-violet text-sm font-semibold mb-5">
            <span>⚡</span> Professional Property Analyser
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink mb-4 leading-tight">
            Know Your Numbers{' '}
            <span className="text-transparent bg-clip-text bg-gradient-brand-violet">Before You Buy</span>
          </h2>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">
            10 professional metrics — the same analysis Mo runs for every client. Instantly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── Input panel ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-surface-border shadow-card p-5 sm:p-8">
            <h3 className="text-xl font-bold text-ink mb-7">Property Details</h3>

            <div className="space-y-7">
              {/* Property Price */}
              <MoneyInput
                label="Property Price"
                value={v.propertyPrice}
                onChange={val => setValue('propertyPrice', val)}
                placeholder="1,500,000"
                hint="Enter any property price"
              />

              {SLIDERS.map(cfg => (
                <Slider key={cfg.key} cfg={cfg} value={v[cfg.key] as number} onChange={val => setValue(cfg.key, val)} />
              ))}

              {/* Annual Rent */}
              <MoneyInput
                label="Annual Rent (gross)"
                value={v.expectedAnnualRent}
                onChange={val => setValue('expectedAnnualRent', val)}
                placeholder="96,000"
                hint="AED 8,000/mo = AED 96,000/yr"
              />

              {/* Property Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-ink-muted text-sm font-medium">Property Size (sq ft)</label>
                  <span className="text-ink font-bold">{v.propertySizeSqft > 0 ? `${v.propertySizeSqft.toLocaleString()} sq ft` : '—'}</span>
                </div>
                <input
                  type="number" min={0} step={50}
                  value={v.propertySizeSqft || ''}
                  placeholder="e.g. 850"
                  onChange={e => setValue('propertySizeSqft', parseInt(e.target.value) || 0)}
                  className="w-full border border-surface-border rounded-xl px-4 py-2.5 text-sm text-ink bg-surface-alt outline-none focus:border-violet transition-colors"
                />
              </div>

              {/* Service Charge Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-ink-muted text-sm font-medium">Service Charge Rate</label>
                  <span className="text-ink font-bold">
                    {v.serviceChargePerSqft > 0
                      ? v.propertySizeSqft > 0
                        ? `${fAED(v.serviceChargePerSqft * v.propertySizeSqft)}/yr`
                        : `AED ${v.serviceChargePerSqft}/sqft`
                      : '—'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number" min={0} step={0.5}
                    value={v.serviceChargePerSqft || ''}
                    placeholder="e.g. 15"
                    onChange={e => setValue('serviceChargePerSqft', parseFloat(e.target.value) || 0)}
                    className="w-full border border-surface-border rounded-xl px-4 pr-20 py-2.5 text-sm text-ink bg-surface-alt outline-none focus:border-violet transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted text-xs pointer-events-none">AED/sqft/yr</span>
                </div>
                <p className="text-xs text-ink-faint mt-1">
                  {v.serviceChargePerSqft > 0 && v.propertySizeSqft > 0
                    ? `Deducted from gross rent → Net rent: ${fAED((v.expectedAnnualRent) - (v.serviceChargePerSqft * v.propertySizeSqft))}/yr`
                    : 'Enter property size above to calculate total service charge'}
                </p>
              </div>

              <div className="border-t border-surface-border pt-6 space-y-5">
                {/* Mortgage */}
                <Toggle label="Mortgage Financing" on={v.includeMortgage} onToggle={() => setValue('includeMortgage', !v.includeMortgage)} />
                {v.includeMortgage && (
                  <div className="pl-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-ink-muted text-sm">Mortgage Rate</span>
                      <span className="text-ink font-bold">{v.mortgageRate}%</span>
                    </div>
                    <input type="range" min={2} max={8} step={0.1} value={v.mortgageRate}
                      onChange={e => setValue('mortgageRate', parseFloat(e.target.value))}
                      className="w-full h-3 rounded-full appearance-none cursor-pointer touch-none"
                      style={{ background: `linear-gradient(to right,#7C3AED 0%,#123ba3 ${((v.mortgageRate-2)/6)*100}%,#E5E7EB ${((v.mortgageRate-2)/6)*100}%,#E5E7EB 100%)` }}
                    />
                  </div>
                )}

                {/* Commission */}
                <div>
                  <Toggle label="Ready Property — 2% Agency Commission" on={v.includeCommission} onToggle={() => setValue('includeCommission', !v.includeCommission)}
                    sub={v.includeCommission ? `Commission: ${fAED(v.propertyPrice * 0.02)} added to investment` : undefined}
                  />
                </div>

                {/* DLD Fee */}
                <div>
                  <Toggle label="4% DLD Registration Fee" on={v.includeDLD} onToggle={() => setValue('includeDLD', !v.includeDLD)}
                    sub={v.includeDLD ? `DLD: ${fAED(v.propertyPrice * 0.04)} added to investment` : 'One-time transfer fee — ready properties'}
                  />
                </div>

              </div>
            </div>

            <button onClick={calculate} disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-brand-violet text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5 disabled:opacity-50">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analysing…</span>
                : results ? 'Recalculate →' : 'Run Full Analysis →'}
            </button>
          </motion.div>

          {/* ── Results panel ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <AnimatePresence mode="wait">
              {!results ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-surface-border shadow-card p-5 sm:p-8 min-h-[460px] flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-violet-pale border border-violet/20 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-3">10-Metric Property Analysis</h3>
                  <p className="text-ink-muted text-sm max-w-xs mb-6">Set your numbers and click "Run Full Analysis" to get a complete professional breakdown.</p>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-xs text-left">
                    {['Gross & Net Yield','IRR (5-Year)','Cash-on-Cash Return','Cap Rate','Break-Even Occupancy','Price-to-Rent Ratio','Operating Expenses','Service Charge Impact','Tenant Demand','Holding Costs'].map(m => (
                      <div key={m} className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet/40 flex-shrink-0" />{m}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-surface-border shadow-card p-5 sm:p-8 space-y-4">

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-ink">Full Property Analysis</h3>
                    <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold border border-green-100">Live</span>
                  </div>

                  {/* Hero numbers */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Gross Yield', value: fPct(results.grossRentalYield), color: 'text-violet' },
                      { label: 'Net Yield',   value: fPct(results.netRentalYield),   color: 'text-brand' },
                      { label: 'IRR 5-Yr',    value: fPct(results.irr5Year),         color: 'text-violet' },
                    ].map(c => (
                      <div key={c.label} className="bg-violet-pale border border-violet/15 rounded-xl p-3 text-center">
                        <div className={`text-xl font-black ${c.color}`}>{c.value}</div>
                        <div className="text-xs text-ink-faint mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* 1. Yield Analysis */}
                  <Section title="Yield Analysis" icon="📈">
                    <Metric label="Gross Rental Yield" value={fPct(results.grossRentalYield)} sub="Annual rent ÷ property price" accent="text-violet" />
                    <Metric label="Net Rental Yield"   value={fPct(results.netRentalYield)}   sub="After all operating costs" accent="text-violet" />
                    <Metric label="Cap Rate"           value={fPct(results.capRate)}           sub="NOI ÷ property value (no financing)" accent="text-brand" />
                    <Metric label="Cash-on-Cash Return" value={fPct(results.cashOnCashReturn)} sub="Annual cash flow ÷ cash invested"
                      accent={results.cashOnCashReturn > 0 ? 'text-green-600' : 'text-red-500'} />
                  </Section>

                  {/* 3. Mortgage Breakdown */}
                  {results.mortgageDetails && (
                    <Section title="Mortgage Breakdown" icon="🏦">
                      <Metric label="Loan Amount"         value={fAED(results.mortgageDetails.loanAmount)}
                        sub={`${results.mortgageDetails.ltvPercent}% LTV`} />
                      <Metric label="Interest Rate"       value={`${results.mortgageDetails.rate}% p.a.`}
                        sub="Annual rate (fixed as entered)" />
                      <Metric label="Monthly Payment"     value={fAED(results.mortgageDetails.monthlyPayment)}
                        sub="Principal & interest (P&I)" accent="text-violet" />
                      <Metric label="Annual Interest Cost" value={fAED(results.mortgageDetails.annualInterestCost)}
                        sub="Approximate year 1 interest" />
                      <Metric label="Total Interest Paid" value={fAED(results.mortgageDetails.totalInterest)}
                        sub={`Over full ${results.mortgageDetails.termYears}-year term`}
                        accent="text-amber-600" />
                      <Metric label="Total Repayable"     value={fAED(results.mortgageDetails.totalRepayable)}
                        sub="Loan + all interest" />
                      <Metric label="Equity from Day 1"   value={fAED(results.mortgageDetails.equityFromDay1)}
                        sub="Your down payment = instant ownership stake" accent="text-green-600" />
                    </Section>
                  )}

                  {/* 4. Operating Expenses */}
                  <Section title="Operating Expenses" icon="🏗️">
                    <Metric label="Service Charge" value={fAED(results.operatingExpenses.serviceCharge)}
                      sub={`Deducted from gross rent`} accent="text-ink" />
                    <Metric label="Total Annual Opex" value={fAED(results.operatingExpenses.total)} accent="text-ink" />
                    <Metric label="Service Charge Impact" value={fPct(results.serviceChargeAsRentPercent)}
                      sub="% of gross rent consumed by service charge"
                      accent={results.serviceChargeAsRentPercent > 15 ? 'text-amber-600' : 'text-ink'} />
                  </Section>

                  {/* 4. Investment Intelligence */}
                  <Section title="Investment Intelligence" icon="🧠">
                    <Metric label="IRR (5-Year)"         value={fPct(results.irr5Year)}
                      sub="Total annualised return including exit"
                      accent={results.irr5Year > 12 ? 'text-green-600' : results.irr5Year > 7 ? 'text-violet' : 'text-amber-600'} />
                    <Metric label="Break-Even Occupancy" value={fPct(results.breakEvenOccupancy, 1)}
                      sub="Minimum occupancy to cover all costs"
                      accent={results.breakEvenOccupancy < 70 ? 'text-green-600' : results.breakEvenOccupancy < 90 ? 'text-amber-600' : 'text-red-500'} />
                    <Metric label="Price-to-Rent Ratio"  value={`${results.priceToRentRatio.toFixed(1)}×`}
                      sub="Below 20× = good value for investors"
                      accent={results.priceToRentRatio < 15 ? 'text-green-600' : results.priceToRentRatio < 22 ? 'text-amber-600' : 'text-red-500'} />
                    <Metric label="Annual Holding Costs" value={fAED(results.annualHoldingCosts)} sub="Total yearly outgoings" />
                  </Section>

                  {/* 5. Tenant Demand */}
                  <div className={`rounded-xl border p-4 ${DEMAND_STYLE[results.tenantDemandScore].bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${DEMAND_STYLE[results.tenantDemandScore].dot}`} />
                      <span className={`text-sm font-bold ${DEMAND_STYLE[results.tenantDemandScore].text}`}>
                        Tenant Demand: {results.tenantDemandScore}
                      </span>
                    </div>
                    <p className={`text-xs ${DEMAND_STYLE[results.tenantDemandScore].text} opacity-80`}>
                      {results.tenantDemandReason}
                    </p>
                  </div>

                  {/* 6. 5-Year Projection */}
                  <Section title="5-Year Projection" icon="📊">
                    <Metric label="Projected Property Value" value={fAED(results.projectedValueAfter5Years)} accent="text-ink" />
                    <Metric label="Equity After 5 Years"    value={fAED(results.equityAfter5Years)}         accent="text-green-600" />
                    <Metric label="Total Rental Cash Flow"  value={fAED(results.totalCashFlowAfter5Years)}
                      accent={results.totalCashFlowAfter5Years >= 0 ? 'text-green-600' : 'text-red-500'} />
                    <Metric label="Total 5-Year Return"     value={fPct(results.totalReturnAfter5Years)}
                      sub="On invested capital"
                      accent={results.totalReturnAfter5Years > 50 ? 'text-green-600' : 'text-violet'} />
                  </Section>

                  {/* Investment summary */}
                  <div className="bg-gradient-to-br from-violet-pale to-blue-50 border border-violet/20 rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-bold text-ink mb-2">Your Investment</p>
                    <Metric label="Down Payment" value={fAED((v.propertyPrice * v.downPaymentPercent) / 100)} />
                    {results.agencyCommission && <Metric label="Agency Commission (2%)" value={fAED(results.agencyCommission)} />}
                    {results.dldFee && <Metric label="DLD Registration Fee (4%)" value={fAED(results.dldFee)} />}
                    <Metric label="Total Cash Required" value={fAED(results.totalInvestment)} accent="text-violet" />
                  </div>

                  {/* CTA */}
                  <button onClick={() => onLeadGate?.(results)}
                    className="w-full py-4 bg-gradient-brand-violet text-white rounded-xl font-bold text-base shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5 transition-all duration-300">
                    Get Personalised Property Matches →
                  </button>
                  <p className="text-center text-xs text-ink-faint">
                    Free • Mo personally shortlists deals matching these exact numbers
                  </p>

                  <button onClick={() => setResults(null)} className="w-full py-2 text-ink-faint hover:text-ink-muted text-sm transition-colors">
                    ← Recalculate
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
