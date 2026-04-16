import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { scoreLead, getRedirectUrl } from '@/lib/lead-scoring'

async function sendEmails(lead: {
  name: string
  phone: string
  budget_range: string
  buying_timeline: string
  score: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 're_XXXXXXXXXX') return // skip if not configured

  const notificationEmail = process.env.NOTIFICATION_EMAIL || 'moamjed66@gmail.com'
  const fromEmail = process.env.EMAIL_FROM || 'noreply@moamjed.com'

  const scoreEmoji = lead.score === 'HIGH' ? '🔥' : lead.score === 'MEDIUM' ? '⚡' : '📬'
  const scoreLabel = lead.score === 'HIGH' ? 'HOT LEAD' : lead.score === 'MEDIUM' ? 'WARM LEAD' : 'NURTURE'

  // 1. Notification to Mo
  const notifyHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7C3AED,#123ba3);padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">New Lead ${scoreEmoji} ${scoreLabel}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;">via moamjed.com</p>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#6b7280;font-size:14px;width:40%;">Name</td><td style="padding:10px 0;color:#1e1b4b;font-weight:600;">${lead.name}</td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:14px;">Phone / WhatsApp</td><td style="padding:10px 0;color:#1e1b4b;font-weight:600;"><a href="https://wa.me/${lead.phone.replace(/\D/g, '')}" style="color:#7C3AED;">${lead.phone}</a></td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:14px;">Budget</td><td style="padding:10px 0;color:#1e1b4b;font-weight:600;">${lead.budget_range}</td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:14px;">Timeline</td><td style="padding:10px 0;color:#1e1b4b;font-weight:600;">${lead.buying_timeline}</td></tr>
          <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0;color:#6b7280;font-size:14px;">Score</td><td style="padding:10px 0;"><span style="background:${lead.score === 'HIGH' ? '#fef2f2' : lead.score === 'MEDIUM' ? '#fffbeb' : '#f0fdf4'};color:${lead.score === 'HIGH' ? '#dc2626' : lead.score === 'MEDIUM' ? '#d97706' : '#16a34a'};padding:4px 12px;border-radius:20px;font-size:13px;font-weight:700;">${scoreEmoji} ${lead.score}</span></td></tr>
        </table>
        <div style="margin-top:24px;">
          <a href="https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi+${encodeURIComponent(lead.name)}%2C+I+saw+your+enquiry+on+moamjed.com+and+I%27d+love+to+help+you+find+the+right+Dubai+property." style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">💬 Reply on WhatsApp</a>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">Mo Amjed Real Estate · DIFC, Dubai, UAE · moamjed.com</div>
    </div>
  `

  // 2. Confirmation to lead
  const confirmHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7C3AED,#123ba3);padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Thanks, ${lead.name}! 🏙️</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;">Your enquiry has been received</p>
      </div>
      <div style="padding:32px;">
        <p style="color:#374151;line-height:1.6;">Hi ${lead.name},</p>
        <p style="color:#374151;line-height:1.6;">Thank you for your interest in Dubai real estate investment. I've received your enquiry and will be in touch with you shortly to discuss the best opportunities that match your goals.</p>
        <div style="background:#f5f3ff;border-left:4px solid #7C3AED;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <p style="margin:0;color:#1e1b4b;font-weight:600;">What happens next?</p>
          <ul style="margin:8px 0 0;padding-left:20px;color:#374151;line-height:1.8;">
            <li>I'll review your investment criteria (${lead.budget_range} · ${lead.buying_timeline})</li>
            <li>I'll prepare a shortlist of high-ROI properties for you</li>
            <li>We'll connect via WhatsApp or a call to discuss your options</li>
          </ul>
        </div>
        <p style="color:#374151;line-height:1.6;">In the meantime, feel free to WhatsApp me directly:</p>
        <a href="https://wa.me/971544245800?text=Hi+Mo%2C+I+just+filled+in+my+details+on+your+website+and+I%27m+ready+to+discuss+investment+options." style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px;">💬 WhatsApp Mo Now</a>
        <p style="color:#6b7280;font-size:14px;">Warm regards,<br/><strong style="color:#1e1b4b;">Mo Amjed</strong><br/>Dubai Real Estate Broker<br/>+971 54 424 5800</p>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">Mo Amjed Real Estate · DIFC, Dubai, UAE · <a href="https://moamjed.com" style="color:#9ca3af;">moamjed.com</a><br/>You're receiving this because you submitted your details on our website.</div>
    </div>
  `

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  await Promise.allSettled([
    // Notification to Mo
    resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      subject: `${scoreEmoji} New ${lead.score} Lead: ${lead.name} (${lead.budget_range})`,
      html: notifyHtml,
    }),
    // Confirmation to lead (only if they provided an email — phone leads skip this)
    // We check for email in body; for now we send to Mo only (phone-only leads)
  ])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, budget_range, buying_timeline, calculator_data } = body

    if (!name || !phone || !budget_range || !buying_timeline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const score = scoreLead({ budget_range, buying_timeline })
    const redirectUrl = getRedirectUrl(score, { budget_range, buying_timeline, name })

    const lead = {
      name,
      phone,
      email: email || null,
      budget_range,
      buying_timeline,
      score,
      calculator_data: calculator_data || null,
      source: 'website',
    }

    const { error } = await getSupabase().from('leads').insert(lead)
    if (error) console.error('Supabase error:', error)

    // Send emails (fire and forget — don't block response)
    sendEmails({ name, phone, budget_range, buying_timeline, score }).catch(console.error)

    // If lead has an email, send them a confirmation too
    if (email && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_XXXXXXXXXX') {
      const scoreEmoji = score === 'HIGH' ? '🔥' : score === 'MEDIUM' ? '⚡' : '📬'
      const fromEmail = process.env.EMAIL_FROM || 'noreply@moamjed.com'
      const confirmHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#7C3AED,#123ba3);padding:24px 32px;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Thanks, ${name}! 🏙️</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;">Your enquiry has been received</p>
          </div>
          <div style="padding:32px;">
            <p style="color:#374151;line-height:1.6;">Hi ${name},</p>
            <p style="color:#374151;line-height:1.6;">Thank you for your interest in Dubai real estate investment. I've received your enquiry and will be in touch with you shortly to discuss the best opportunities that match your goals.</p>
            <div style="background:#f5f3ff;border-left:4px solid #7C3AED;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
              <p style="margin:0;color:#1e1b4b;font-weight:600;">What happens next?</p>
              <ul style="margin:8px 0 0;padding-left:20px;color:#374151;line-height:1.8;">
                <li>I'll review your investment criteria (${budget_range} · ${buying_timeline})</li>
                <li>I'll prepare a shortlist of high-ROI properties for you</li>
                <li>We'll connect via WhatsApp or a call to discuss your options</li>
              </ul>
            </div>
            <a href="https://wa.me/971544245800?text=Hi+Mo%2C+I+just+filled+in+my+details+on+your+website." style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px;">💬 WhatsApp Mo Now</a>
            <p style="color:#6b7280;font-size:14px;">Warm regards,<br/><strong style="color:#1e1b4b;">Mo Amjed</strong><br/>Dubai Real Estate Broker<br/>+971 54 424 5800</p>
          </div>
          <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">Mo Amjed Real Estate · DIFC, Dubai, UAE · <a href="https://moamjed.com" style="color:#9ca3af;">moamjed.com</a></div>
        </div>
      `
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `${scoreEmoji} Your Dubai Property Enquiry — Mo Amjed Real Estate`,
        html: confirmHtml,
      }).catch(console.error)
    }

    return NextResponse.json({ score, redirectUrl, success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
