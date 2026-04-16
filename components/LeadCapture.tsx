'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { BUDGET_OPTIONS, TIMELINE_OPTIONS, scoreLead, getRedirectUrl } from '@/lib/lead-scoring'
import { analytics } from '@/lib/analytics'
import { sendLeadNotification, sendThankYouEmail } from '@/lib/email-client'
import type { ROIResult } from '@/lib/roi-calc'

type LeadForm = { name: string; phone: string; email?: string; budget_range: string; buying_timeline: string }
type Props = {
  prefilledData?: ROIResult
  onSuccess?: (score: string, redirectUrl: string) => void
  title?: string
  subtitle?: string
  compact?: boolean
}

export default function LeadCapture({ prefilledData, onSuccess, title = 'Get Your FREE Dubai Property Report', subtitle = "Tell us about your investment goals and we'll match you with the best opportunities.", compact = false }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<LeadForm>()

  const onSubmit = async (data: LeadForm) => {
    setLoading(true); setError(null)
    try {
      const score = scoreLead({ budget_range: data.budget_range, buying_timeline: data.buying_timeline })
      const redirectUrl = getRedirectUrl(score, { budget_range: data.budget_range, buying_timeline: data.buying_timeline, name: data.name })

      // Save lead directly to Supabase from client
      try {
        const { getSupabase } = await import('@/lib/supabase')
        await getSupabase().from('leads').insert({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          budget_range: data.budget_range,
          buying_timeline: data.buying_timeline,
          score,
          calculator_data: prefilledData || null,
          source: 'website',
        })
      } catch (dbErr) {
        console.warn('Supabase insert failed (env vars may not be set):', dbErr)
      }

      analytics.leadSubmitted(score)

      // Send emails (fire and forget — non-blocking)
      sendLeadNotification({
        name: data.name,
        phone: data.phone,
        email: data.email,
        budget_range: data.budget_range,
        buying_timeline: data.buying_timeline,
        score,
        roiData: prefilledData || undefined,
      }).catch(console.warn)

      if (data.email) {
        sendThankYouEmail({
          name: data.name,
          email: data.email,
          budget_range: data.budget_range,
          buying_timeline: data.buying_timeline,
          score,
          roiData: prefilledData || undefined,
        }).catch(console.warn)
      }

      setSubmitted(true)
      setTimeout(() => { onSuccess?.(score, redirectUrl); if (redirectUrl && !onSuccess) window.open(redirectUrl, '_blank') }, 1500)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-ink mb-2">You're in!</h3>
          <p className="text-ink-muted">Redirecting you to the next step...</p>
          <div className="mt-4 w-8 h-8 border-2 border-violet/20 border-t-violet rounded-full animate-spin" />
        </motion.div>
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {!compact && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-ink mb-2">{title}</h3>
              <p className="text-ink-muted text-sm">{subtitle}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-body mb-2">Full Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text" placeholder="e.g. Ahmed Al Rashid"
              className="w-full bg-surface-alt border border-surface-border focus:border-violet text-ink placeholder-ink-faint rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-200"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-body mb-2">Email Address <span className="text-ink-faint font-normal">(optional — for your report copy)</span></label>
            <input
              {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
              type="email" placeholder="you@example.com"
              className="w-full bg-surface-alt border border-surface-border focus:border-violet text-ink placeholder-ink-faint rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-200"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-body mb-2">Phone / WhatsApp *</label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 py-3 bg-surface-alt border border-surface-border rounded-xl text-ink-muted text-sm whitespace-nowrap flex-shrink-0">🇦🇪 +971</div>
              <input
                {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{7,12}$/, message: 'Enter a valid number' } })}
                type="tel" placeholder="50 123 4567"
                className="flex-1 bg-surface-alt border border-surface-border focus:border-violet text-ink placeholder-ink-faint rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-200"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-body mb-2">Investment Budget *</label>
            <select
              {...register('budget_range', { required: 'Please select a budget' })}
              className="w-full bg-surface-alt border border-surface-border focus:border-violet text-ink rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-200 appearance-none cursor-pointer"
            >
              <option value="" className="bg-white">Select budget range...</option>
              {BUDGET_OPTIONS.map((opt) => <option key={opt.value} value={opt.value} className="bg-white">{opt.label}</option>)}
            </select>
            {errors.budget_range && <p className="text-red-500 text-xs mt-1">{errors.budget_range.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-body mb-2">Buying Timeline *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TIMELINE_OPTIONS.map((opt) => (
                <label key={opt.value} className="relative flex items-center justify-center text-center p-3 rounded-xl border border-surface-border hover:border-violet/50 cursor-pointer transition-all duration-200 has-[:checked]:border-violet has-[:checked]:bg-violet-pale">
                  <input {...register('buying_timeline', { required: 'Please select a timeline' })} type="radio" value={opt.value} className="sr-only" />
                  <span className="text-xs text-ink-muted has-checked:text-violet font-medium leading-tight">{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.buying_timeline && <p className="text-red-500 text-xs mt-1">{errors.buying_timeline.message}</p>}
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-brand-violet text-white rounded-xl font-bold text-base transition-all duration-300 shadow-violet hover:shadow-violet-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : 'Get My Property Report →'}
          </button>

          <p className="text-center text-xs text-ink-faint">🔒 100% confidential · No spam · We contact you within 2 hours</p>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
