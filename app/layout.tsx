import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = 'https://moamjed.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mo Amjed — Dubai Property Investment Specialist',
    template: '%s | Mo Amjed',
  },
  description:
    'Mo Amjad is Dubai\'s trusted property investment specialist. Calculate your ROI in 60 seconds, explore high-yield properties, and invest with precision. RERA licensed broker based in DIFC, Dubai.',
  keywords: [
    'Mo Amjad',
    'Mo Amjed',
    'Dubai real estate',
    'Dubai property investment',
    'Dubai property broker',
    'high ROI Dubai property',
    'Dubai rental yield',
    'off-plan Dubai property',
    'RERA licensed broker Dubai',
    'Dubai investment property',
    'buy property in Dubai',
    'Dubai real estate agent',
    'invest in Dubai',
    'Dubai property 2024',
    'Dubai property 2025',
    'DIFC real estate',
    'Mo Amjad broker',
    'Mo Amjad Dubai',
  ],
  authors: [{ name: 'Mo Amjad', url: BASE_URL }],
  creator: 'Mo Amjad',
  publisher: 'Mo Amjad Real Estate',
  category: 'Real Estate',
  classification: 'Real Estate Investment',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    alternateLocale: ['en_GB', 'en_US'],
    url: BASE_URL,
    siteName: 'Mo Amjad Real Estate',
    title: 'Mo Amjad — Find High-ROI Dubai Properties | RERA Licensed Broker',
    description:
      'Dubai\'s trusted property investment broker. Use our live ROI calculator, discover high-yield properties, and invest in Dubai with precision. Connect with Mo Amjad today.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mo Amjad — Dubai Real Estate Investment Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mo Amjad — Dubai Property Investment Specialist',
    description: 'Calculate your Dubai property ROI in 60 seconds. RERA licensed broker. High-yield properties in DIFC, Marina, Downtown & beyond.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification token here after setup
    // google: 'your-google-verification-token',
  },
}

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Structured Data for Google rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': `${BASE_URL}/#agent`,
      name: 'Mo Amjad',
      alternateName: 'Mo Amjed',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
      image: `${BASE_URL}/og-image.jpg`,
      description:
        'Mo Amjad is a RERA-licensed Dubai real estate broker specialising in high-ROI investment properties. Based in DIFC, Dubai.',
      telephone: '+971544245800',
      email: 'mo@moamjed.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'DIFC',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
        sameAs: 'https://www.wikidata.org/wiki/Q612',
      },
      knowsAbout: [
        'Dubai Real Estate Investment',
        'Off-Plan Properties Dubai',
        'High-ROI Properties',
        'Dubai Rental Yield',
        'DIFC Properties',
        'Downtown Dubai Properties',
        'Dubai Marina Properties',
        'Business Bay Properties',
      ],
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'RERA License',
        credentialCategory: 'Real Estate Broker License',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Real Estate Regulatory Agency (RERA)',
          address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
        },
      },
      sameAs: [
        `https://wa.me/971544245800`,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Mo Amjad Real Estate',
      description: 'Dubai property investment platform — ROI calculator, featured properties, and direct broker access.',
      publisher: { '@id': `${BASE_URL}/#agent` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#business`,
      name: 'Mo Amjad Real Estate',
      url: BASE_URL,
      telephone: '+971544245800',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'DIFC',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '25.2048',
        longitude: '55.2708',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
      priceRange: '$$$$',
    },
  ],
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-ink antialiased">
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
                  anonymize_ip: true,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
