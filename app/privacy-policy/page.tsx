import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Mo Amjed Real Estate',
  description: 'Privacy Policy for Mo Amjed Real Estate — how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicy() {
  const year = new Date().getFullYear()
  return (
    <main className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-violet hover:text-violet-dark text-sm flex items-center gap-2 mb-8 transition-colors">← Back to Homepage</Link>
        <h1 className="text-4xl font-black text-ink mb-2">Privacy Policy</h1>
        <p className="text-ink-muted mb-10">Last updated: April {year}</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-ink-body">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-ink mb-3">{s.title}</h2>
              {s.content.map((p, i) => <p key={i} className="mb-3 leading-relaxed">{p}</p>)}
              {s.list && <ul className="list-disc pl-5 space-y-1">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-surface-alt border border-surface-border rounded-2xl">
          <h3 className="text-ink font-bold mb-2">Contact Us</h3>
          <p className="text-ink-muted text-sm">For privacy-related enquiries, contact us at: <a href="mailto:privacy@moamjed.com" className="text-violet hover:underline">privacy@moamjed.com</a></p>
        </div>
      </div>
    </main>
  )
}

const sections = [
  {
    title: '1. Who We Are',
    content: ['Mo Amjed Real Estate ("we", "us", "our") is a licensed Dubai real estate brokerage operating under the Real Estate Regulatory Agency (RERA). Our registered address is DIFC, Dubai, United Arab Emirates.', 'This Privacy Policy explains how we collect, use, and protect your personal information when you visit moamjed.com or interact with our services.'],
  },
  {
    title: '2. Information We Collect',
    content: ['We collect information you voluntarily provide, including:'],
    list: ['Full name', 'Phone number / WhatsApp number', 'Email address (if provided)', 'Investment budget and timeline preferences', 'ROI calculator inputs and results', 'IP address and browser information (collected automatically)'],
  },
  {
    title: '3. How We Use Your Information',
    content: ['We use your personal data to:'],
    list: ['Contact you about Dubai property investment opportunities', 'Match you with properties suited to your budget and goals', 'Send you property reports and market updates (with your consent)', 'Improve our website and services', 'Comply with legal obligations'],
  },
  {
    title: '4. Cookies',
    content: ['We use cookies and similar tracking technologies to improve your browsing experience and analyse website traffic. These include:', 'Essential cookies (required for the website to function), Analytics cookies (Google Analytics — to understand how visitors use our site), and Marketing cookies (to personalise content and measure campaign effectiveness).', 'You can manage your cookie preferences via the cookie banner when you first visit our site.'],
  },
  {
    title: '5. Data Sharing',
    content: ['We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our website (e.g., Supabase for data storage, Google for analytics), subject to strict confidentiality agreements.'],
  },
  {
    title: '6. Data Retention',
    content: ['We retain your personal data for as long as necessary to provide our services or as required by law. You may request deletion of your data at any time by emailing us.'],
  },
  {
    title: '7. Your Rights',
    content: ['Under applicable data protection laws, you have the right to:'],
    list: ['Access the personal data we hold about you', 'Correct inaccurate data', 'Request deletion of your data', 'Withdraw consent at any time', 'Lodge a complaint with a supervisory authority'],
  },
  {
    title: '8. Security',
    content: ['We implement appropriate technical and organisational measures to protect your data against unauthorised access, alteration, disclosure, or destruction. All data is transmitted over encrypted HTTPS connections.'],
  },
  {
    title: '9. Changes to This Policy',
    content: ['We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.'],
  },
]
