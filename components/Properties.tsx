'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { analytics } from '@/lib/analytics'

const properties = [
  { name: 'Emaar Beachfront', location: 'Dubai Marina', price: 2_450_000, roi: 8.2, type: 'Luxury Apartment', bedrooms: 2, size: '1,450 sq ft', badge: 'HOT DEAL', badgeClass: 'bg-orange-50 text-orange-600 border-orange-200', gradFrom: '#FFF7ED', gradTo: '#FED7AA', skyColor: 'rgba(234,88,12,0.15)', features: ['Sea View', 'Private Beach', 'Smart Home'] },
  { name: 'Downtown Heights', location: 'Downtown Dubai', price: 3_800_000, roi: 7.8, type: 'Premium Penthouse', bedrooms: 3, size: '2,800 sq ft', badge: 'HIGH ROI', badgeClass: 'bg-violet-pale text-violet border-violet/20', gradFrom: '#F5F3FF', gradTo: '#DDD6FE', skyColor: 'rgba(124,58,237,0.15)', features: ['Burj View', 'Private Pool', 'Concierge'] },
  { name: 'Creek Harbour Vista', location: 'Dubai Creek', price: 1_650_000, roi: 9.1, type: 'Waterfront Apartment', bedrooms: 1, size: '850 sq ft', badge: 'BEST YIELD', badgeClass: 'bg-green-50 text-green-600 border-green-200', gradFrom: '#F0FDF4', gradTo: '#BBF7D0', skyColor: 'rgba(22,163,74,0.12)', features: ['Creek View', 'Metro Access', 'Co-Working'] },
  { name: 'Palm Signature Villa', location: 'Palm Jumeirah', price: 12_500_000, roi: 6.5, type: 'Private Villa', bedrooms: 5, size: '8,200 sq ft', badge: 'EXCLUSIVE', badgeClass: 'bg-blue-50 text-brand border-brand/20', gradFrom: '#EFF6FF', gradTo: '#BFDBFE', skyColor: 'rgba(18,59,163,0.12)', features: ['Private Beach', 'Infinity Pool', 'Smart Home'] },
  { name: 'Business Bay Tower', location: 'Business Bay', price: 980_000, roi: 10.2, type: 'Studio Investment', bedrooms: 0, size: '450 sq ft', badge: '10% YIELD', badgeClass: 'bg-green-50 text-green-600 border-green-200', gradFrom: '#F0FDF4', gradTo: '#D1FAE5', skyColor: 'rgba(16,185,129,0.12)', features: ['High Demand', 'Furnished', 'Metro Access'] },
  { name: 'MBR City Residences', location: 'MBR City', price: 2_100_000, roi: 8.7, type: 'Family Villa', bedrooms: 4, size: '3,500 sq ft', badge: 'NEW LAUNCH', badgeClass: 'bg-violet-pale text-violet border-violet/20', gradFrom: '#F5F3FF', gradTo: '#EDE9FE', skyColor: 'rgba(124,58,237,0.1)', features: ['Community Pool', 'Gated', 'Park Views'] },
]

function formatAED(n: number) {
  return n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(2)}M` : `AED ${(n / 1_000).toFixed(0)}K`
}

export default function Properties() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971501234567'

  return (
    <section id="properties" ref={ref} className="relative py-24 bg-surface-alt overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/20 bg-blue-50 text-brand text-sm font-semibold mb-6">
            <span>🏙️</span> Featured Properties
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-ink mb-4">
            Hand-Picked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-brand-violet">High-Yield</span>{' '}
            Deals
          </h2>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">Every property is personally vetted for ROI potential, location desirability, and developer reliability.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-white border border-surface-border rounded-2xl overflow-hidden hover:border-surface-border-accent transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
            >
              {/* Visual */}
              <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${property.gradFrom}, ${property.gradTo})` }}>
                <svg className="absolute bottom-0 w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <path d={`M0,120 L0,${70+i*4} L25,${70+i*4} L25,${50+i*3} L45,${50+i*3} L45,${30+i*4} L60,${30+i*4} L60,${20+i*2} L75,${20+i*2} L75,${10+i} L85,${10+i} L85,${20+i*2} L100,${20+i*2} L100,${35+i*3} L120,${35+i*3} L120,${22+i*2} L135,${22+i*2} L135,${12+i} L150,${12+i} L150,${22+i*2} L165,${22+i*2} L165,${38+i*3} L185,${38+i*3} L185,${48+i*4} L200,${48+i*4} L200,${33+i*3} L215,${33+i*3} L215,${18+i*2} L235,${18+i*2} L235,${28+i*3} L255,${28+i*3} L255,${43+i*4} L270,${43+i*4} L270,${53+i*4} L285,${53+i*4} L285,${38+i*3} L305,${38+i*3} L305,${53+i*4} L325,${53+i*4} L325,${63+i*4} L350,${63+i*4} L350,${73+i*4} L375,${73+i*4} L375,${78+i*3} L400,${78+i*3} L400,120 Z`}
                    fill={property.skyColor}
                  />
                </svg>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${property.badgeClass}`}>{property.badge}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-surface-border">
                  <span className="text-violet font-black text-xl">{property.roi}%</span>
                  <span className="text-ink-muted text-xs ml-1">yield</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-ink font-bold text-lg leading-tight">{property.name}</h3>
                    <div className="flex items-center gap-1 text-ink-muted text-sm mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-ink font-black text-lg">{formatAED(property.price)}</div>
                    <div className="text-ink-faint text-xs">{property.type}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 text-ink-muted text-sm">
                  {property.bedrooms > 0 && <span>{property.bedrooms} BR</span>}
                  {property.bedrooms > 0 && <span>·</span>}
                  <span>{property.size}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {property.features.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded-md bg-surface-alt text-ink-muted text-xs border border-surface-border">{f}</span>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Mo, I'm interested in ${property.name} in ${property.location} (${formatAED(property.price)}). Can you share more details?`)}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => { analytics.propertyViewed(property.name); analytics.whatsappClicked(`property_${property.name}`) }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-violet-pale hover:bg-gradient-brand-violet text-violet hover:text-white rounded-xl border border-violet/20 hover:border-transparent font-semibold text-sm transition-all duration-300"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Inquire on WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} className="text-center mt-12">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Mo, I want to see your full portfolio of Dubai investment properties.')}`}
            target="_blank" rel="noopener noreferrer"
            onClick={() => analytics.whatsappClicked('view_more_properties')}
            className="inline-flex items-center gap-2 px-8 py-4 border border-violet/30 text-violet hover:bg-gradient-brand-violet hover:text-white hover:border-transparent rounded-xl font-semibold transition-all duration-300 shadow-soft hover:shadow-violet"
          >
            View Full Portfolio
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
