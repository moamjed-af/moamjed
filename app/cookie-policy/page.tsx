import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | Mo Amjed Real Estate',
  description: 'Cookie Policy for Mo Amjed Real Estate — how we use cookies on our website.',
}

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-white py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-violet hover:text-violet-dark text-sm flex items-center gap-2 mb-8 transition-colors">← Back to Homepage</Link>
        <h1 className="text-4xl font-black text-ink mb-2">Cookie Policy</h1>
        <p className="text-ink-muted mb-10">Last updated: April {new Date().getFullYear()}</p>
        <div className="space-y-8 text-ink-body leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-ink mb-3">What Are Cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences and understand how you interact with it.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink mb-3">Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-surface-alt"><th className="text-left p-3 border border-surface-border text-ink font-semibold">Type</th><th className="text-left p-3 border border-surface-border text-ink font-semibold">Purpose</th><th className="text-left p-3 border border-surface-border text-ink font-semibold">Duration</th></tr></thead>
                <tbody>
                  {[
                    ['Essential', 'Required for the website to function (cookie consent preference)', 'Session / 1 year'],
                    ['Analytics', 'Google Analytics — understand visitor behaviour anonymously', '2 years'],
                    ['Marketing', 'Track campaign performance and personalise content', '90 days'],
                  ].map(([type, purpose, duration]) => (
                    <tr key={type}><td className="p-3 border border-surface-border">{type}</td><td className="p-3 border border-surface-border">{purpose}</td><td className="p-3 border border-surface-border">{duration}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink mb-3">Managing Cookies</h2>
            <p>You can manage or disable cookies through your browser settings. Note that disabling essential cookies may affect website functionality. You can also change your consent preferences at any time by clearing your browser cookies and revisiting our site.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-ink mb-3">Contact</h2>
            <p>For questions about our cookie use: <a href="mailto:privacy@moamjed.com" className="text-violet hover:underline">privacy@moamjed.com</a></p>
          </section>
        </div>
      </div>
    </main>
  )
}
