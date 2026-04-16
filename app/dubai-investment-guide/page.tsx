import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dubai Property Investment Guide 2025 | Mo Amjed',
  description: 'The complete guide to investing in Dubai real estate — top areas, ROI benchmarks, off-plan strategy, visa benefits, and more.',
}

export default function DubaiInvestmentGuide() {
  return (
    <main className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link href="/" className="text-violet hover:text-violet/70 text-sm flex items-center gap-2 mb-8 transition-colors font-medium">
            ← Back to Homepage
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-violet-pale text-violet text-sm font-semibold mb-5">
            📚 Free Investment Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-ink mb-4 leading-tight">
            Dubai Property Investment<br />Guide 2025
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            Everything you need to know before investing in Dubai real estate — written by Mo Amjed, Dubai's precision investment specialist.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="bg-white border border-surface-border rounded-2xl p-7 shadow-card">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <span>{section.emoji}</span> {section.title}
              </h2>
              <div className="space-y-3 text-ink-muted leading-relaxed">
                {section.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-4 space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-ink-body text-sm">
                      <span className="text-violet mt-0.5 flex-shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-violet/10 to-brand/10 border border-violet/20 rounded-2xl p-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet/20 bg-white text-violet text-sm font-semibold mb-4">
            🚀 Ready to Invest?
          </div>
          <h2 className="text-3xl font-black text-ink mb-3">Start With Your ROI Calculation</h2>
          <p className="text-ink-muted mb-8 max-w-md mx-auto">Use our live ROI calculator or book a free strategy call with Mo Amjed to explore your options.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#calculator"
              className="px-8 py-3.5 bg-gradient-brand-violet text-white rounded-xl font-semibold text-sm shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Use ROI Calculator
            </Link>
            <Link
              href="/#book-call"
              className="px-8 py-3.5 border border-violet/30 text-violet hover:bg-violet-pale rounded-xl font-semibold text-sm transition-all duration-200"
            >
              Book a Free Strategy Call
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

const sections = [
  {
    emoji: '🏙️',
    title: 'Why Dubai Real Estate?',
    content: [
      'Dubai has established itself as one of the world\'s premier real estate investment destinations. With 0% income tax, 0% capital gains tax, and a rapidly growing population, the fundamentals for property investment are exceptionally strong.',
      'The emirate continues to attract global capital, with foreign investors accounting for over 70% of transactions in prime areas like Dubai Marina and Downtown.',
    ],
    list: [
      'No income tax or capital gains tax on rental income',
      'Rental yields averaging 6–10% vs 2–4% in London/New York',
      'Golden Visa eligibility from AED 2M investment',
      'Growing population: 3.3M+ residents, projected 5.8M by 2040',
      'World-class infrastructure ranked #1 globally',
    ],
  },
  {
    emoji: '📍',
    title: 'Top Investment Areas in 2025',
    content: [
      'Location selection is the most critical factor in Dubai real estate ROI. Here are the areas delivering the strongest yields and capital appreciation:',
    ],
    list: [
      'Business Bay — Studio yields: 9–11% | High rental demand from professionals',
      'Dubai Marina — 7–9% yields | Premium lifestyle, strong resale value',
      'JVC (Jumeirah Village Circle) — 8–10% | Affordable entry, family demand',
      'Downtown Dubai — 6–8% | Iconic location, long-term capital growth',
      'Dubai Creek Harbour — 8–10% | Emerging area, massive upside potential',
      'Palm Jumeirah — 5–7% | Ultra-prime, exceptional capital appreciation',
    ],
  },
  {
    emoji: '📊',
    title: 'Understanding ROI in Dubai',
    content: [
      'Gross rental yield is calculated as annual rent divided by property price. Net yield accounts for costs such as service charges (~1–1.5% p.a.), DLD registration (4%), and occasional vacancy.',
      'For a well-selected property at AED 1M, you can realistically expect AED 70,000–90,000 annual gross rent — a 7–9% gross yield before costs.',
    ],
    list: [
      'Gross yield = Annual Rent / Property Price × 100',
      'Net yield = (Annual Rent - Costs) / Property Price × 100',
      'Total ROI includes both rental income AND capital appreciation',
      'Dubai average capital appreciation: 5–8% per annum (2023–2025)',
    ],
  },
  {
    emoji: '🏗️',
    title: 'Off-Plan vs Ready Properties',
    content: [
      'Off-plan properties (under construction) typically offer 10–25% below market price, flexible payment plans (10/90, 20/80), and strong capital appreciation by handover. Risk is mitigated by buying from RERA-approved Tier 1 developers.',
      'Ready properties offer immediate rental income and are ideal for investors who want cash flow from day one.',
    ],
    list: [
      'Off-plan: Lower entry price, developer payment plans (1–3% per month)',
      'Off-plan: Higher capital gains potential by completion date',
      'Ready: Immediate cash flow, no construction risk',
      'Ready: More negotiation leverage, especially for distressed sellers',
      'Mo\'s recommendation: Balance both for diversified returns',
    ],
  },
  {
    emoji: '🛂',
    title: 'UAE Golden Visa Through Property',
    content: [
      'A property investment of AED 2,000,000 or more qualifies you for a 10-year UAE Golden Visa — providing residency rights, the ability to sponsor family members, and stability for long-term investment.',
    ],
    list: [
      'Minimum AED 2M property value for 10-year Golden Visa',
      'Sponsor spouse, children, and domestic staff',
      'No need to be physically present in UAE (renewable remotely)',
      'Access to UAE banking, business setup, and premium healthcare',
    ],
  },
  {
    emoji: '⚠️',
    title: 'Common Mistakes to Avoid',
    content: [
      'Many investors make costly mistakes that significantly reduce their returns. Here\'s what to avoid:',
    ],
    list: [
      'Buying based on price per sq ft alone — yield and location matter more',
      'Ignoring service charges — can be AED 8,000–25,000/year',
      'Using unlicensed brokers — always verify RERA license',
      'Over-leveraging with high LTV mortgages in a rising rate environment',
      'Ignoring handover timelines — factor in 6–12 months of no income for off-plan',
      'Not understanding DLD, registration, and agency fees (total ~6% of purchase price)',
    ],
  },
]
