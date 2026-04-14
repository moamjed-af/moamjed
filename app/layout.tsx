import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mo Amjed — Dubai Property Investment | High-ROI Real Estate',
  description:
    "Find high-ROI Dubai properties in 60 seconds. Use our live ROI calculator, connect with Mo Amjed — Dubai's premier investment property broker. Precision Protects Profit.",
  keywords: [
    'Dubai real estate',
    'Dubai property investment',
    'high ROI Dubai',
    'Dubai rental yield',
    'Dubai property broker',
    'off-plan Dubai',
    'Mo Amjed',
  ],
  authors: [{ name: 'Mo Amjed' }],
  creator: 'Mo Amjed',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://moamjed.com',
    siteName: 'Mo Amjed Real Estate',
    title: 'Mo Amjed — Find High-ROI Dubai Properties in 60 Seconds',
    description:
      'Use our live ROI calculator to discover your potential returns. Dubai\'s precision property investment specialist.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mo Amjed — Dubai Real Estate Investment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mo Amjed — Dubai Property Investment',
    description: 'Find High-ROI Dubai Properties in 60 Seconds',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#060913',
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-dark text-white antialiased">
        {children}

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
