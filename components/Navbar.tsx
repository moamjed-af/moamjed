'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { analytics } from '@/lib/analytics'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Properties', href: '#properties' },
    { label: 'ROI Calculator', href: '#calculator' },
    { label: 'Testimonials', href: '#trust' },
    { label: 'Book a Call', href: '#book-call' },
  ]

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971501234567'

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-surface-border shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <svg viewBox="0 0 700.85 206.34" className="h-10 w-auto" aria-label="Mo Amjed Logo">
                <polygon
                  fill={scrolled ? '#000000' : '#ffffff'}
                  className="transition-all duration-500"
                  points="349.06 119.06 349.06 206.34 392.19 206.34 392.19 184.28 417.14 184.28 417.14 149.88 392.19 149.88 392.19 138.22 429.35 106.24 429.35 206.34 472.9 206.34 472.9 13.01 349.06 119.06"
                />
                <polygon
                  fill="#123ba3"
                  points="378 13.28 325.06 57.11 281.19 13.39 228.93 13.39 228.93 206.34 272.34 206.34 272.34 65.75 324.43 114.4 443.88 13.28 378 13.28"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className={`font-bold text-lg leading-tight tracking-wider transition-colors duration-500 ${scrolled ? 'text-ink' : 'text-white'}`}>
                MO AMJED
              </div>
              <div className="text-violet text-xs tracking-widest uppercase">Precision Protects Profit</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  scrolled ? 'text-ink-muted hover:text-ink' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-brand-violet group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Mo, I found your website and I'm interested in Dubai property investment. Can we connect?")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.whatsappClicked('navbar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                scrolled
                  ? 'border-surface-border-accent text-violet hover:bg-violet-pale'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
            <a
              href="#book-call"
              onClick={() => analytics.calendlyOpened()}
              className="px-5 py-2 bg-gradient-brand-violet text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 transition-colors ${scrolled ? 'text-ink' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-t border-surface-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-ink-body hover:text-ink text-base font-medium py-2 border-b border-surface-border"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-surface-border-accent text-violet font-medium"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href="#book-call"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 bg-gradient-brand-violet text-white rounded-xl font-semibold text-center"
                >
                  Book a Call
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
