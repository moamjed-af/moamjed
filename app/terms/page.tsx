import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Mo Amjed Real Estate',
  description: 'Terms of Service for Mo Amjed Real Estate.',
}

export default function Terms() {
  return (
    <main className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-violet hover:text-violet-dark text-sm flex items-center gap-2 mb-8 transition-colors">← Back to Homepage</Link>
        <h1 className="text-4xl font-black text-ink mb-2">Terms of Service</h1>
        <p className="text-ink-muted mb-10">Last updated: April {new Date().getFullYear()}</p>
        <div className="space-y-8 text-ink-body leading-relaxed">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing moamjed.com, you agree to these Terms of Service. If you do not agree, please do not use our website.' },
            { title: '2. Services', content: 'Mo Amjed Real Estate provides real estate brokerage services in Dubai, UAE. The ROI calculator and property information on this website are provided for informational purposes only and do not constitute financial or investment advice.' },
            { title: '3. Accuracy of Information', content: 'While we strive for accuracy, property prices, ROI figures, and market data are subject to change. We do not guarantee the accuracy or completeness of any information on this site. Always conduct your own due diligence before making investment decisions.' },
            { title: '4. No Financial Advice', content: 'Nothing on this website constitutes financial, legal, or tax advice. The ROI calculator is a tool for illustration purposes only. Consult qualified professionals before making investment decisions.' },
            { title: '5. Intellectual Property', content: 'All content, logos, and materials on this website are the property of Mo Amjed Real Estate and are protected by applicable intellectual property laws.' },
            { title: '6. Limitation of Liability', content: 'To the maximum extent permitted by law, Mo Amjed Real Estate shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or our services.' },
            { title: '7. Governing Law', content: 'These Terms are governed by the laws of the United Arab Emirates and the Emirate of Dubai. Any disputes shall be resolved in the courts of Dubai.' },
            { title: '8. Changes', content: 'We reserve the right to update these Terms at any time. Continued use of our website after changes constitutes acceptance of the revised Terms.' },
          ].map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-ink mb-3">{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-bold text-ink mb-3">9. Contact</h2>
            <p>Questions about these Terms? Email us at <a href="mailto:legal@moamjed.com" className="text-violet hover:underline">legal@moamjed.com</a></p>
          </section>
        </div>
      </div>
    </main>
  )
}
