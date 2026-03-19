import type { Metadata, Viewport } from 'next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reviewcard.io'

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'ReviewCard — Google Maps Review Cards for Ad Creatives',
    template: '%s — ReviewCard',
  },
  description:
      'Build pixel-perfect Google Maps review cards in seconds. Export high-res social-proof visuals for Meta Ads, Google Ads, and TikTok — and turn 5-star reviews into creatives that convert.',
  keywords: [
    'google maps review card',
    'review card builder',
    'ad creatives',
    'social proof ads',
    'google review screenshot',
    'meta ads creatives',
    'paid ads',
    'ROAS',
    'facebook ads creatives',
    'local business advertising',
  ],
  authors: [{ name: 'ReviewCard', url: BASE_URL }],
  creator: 'ReviewCard',
  publisher: 'ReviewCard',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ReviewCard — Turn 5-Star Reviews Into High-Converting Ad Creatives',
    description:
        'Build pixel-perfect Google Maps review cards in seconds. Export for Meta Ads, Google Ads, TikTok and more.',
    url: BASE_URL,
    siteName: 'ReviewCard',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReviewCard — Google Maps review card builder for ad creatives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReviewCard — Google Maps Review Cards for Ad Creatives',
    description:
        'Build pixel-perfect Google Maps review cards in seconds. Boost ROAS with authentic social-proof creatives.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico',       sizes: 'any' },
      { url: '/favicon.svg',       type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/site.webmanifest',
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
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'WebSite',
                    '@id': `${BASE_URL}/#website`,
                    url: BASE_URL,
                    name: 'ReviewCard',
                    description:
                        'Build pixel-perfect Google Maps review cards for ad creatives.',
                    potentialAction: {
                      '@type': 'SearchAction',
                      target: `${BASE_URL}/?s={search_term_string}`,
                      'query-input': 'required name=search_term_string',
                    },
                  },
                  {
                    '@type': 'WebApplication',
                    '@id': `${BASE_URL}/#app`,
                    name: 'ReviewCard Builder',
                    url: `${BASE_URL}/builder/`,
                    applicationCategory: 'BusinessApplication',
                    operatingSystem: 'Web',
                    offers: {
                      '@type': 'Offer',
                      price: '0',
                      priceCurrency: 'USD',
                    },
                    description:
                        'Build Google Maps review cards for Meta Ads, Google Ads, and TikTok ad creatives.',
                    featureList: [
                      'Live preview',
                      'High-res PNG export',
                      '4 export formats (1:1, 4:5, 9:16, card only)',
                      'Custom backgrounds',
                      'Photo grid support',
                      'Score ratings',
                    ],
                  },
                  {
                    '@type': 'Organization',
                    '@id': `${BASE_URL}/#organization`,
                    name: 'ReviewCard',
                    url: BASE_URL,
                    logo: {
                      '@type': 'ImageObject',
                      url: `${BASE_URL}/web-app-manifest-512x512.png`,
                    },
                  },
                ],
              }),
            }}
        />
      </head>
      <body>{children}</body>
      </html>
  )
}