import {ReactNode} from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import type {Metadata} from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"


export const metadata: Metadata = {
    metadataBase: new URL('https://your-domain.com'),
    title: {
        default: 'JWT Decoder - Free JWT & JWE Tool',
        template: '%s | JWT Decoder',
    },
    description:
        'Free, secure JWT and JWE decoder and encoder. Privacy-first, client-side token debugging.',
    alternates: {
        canonical: 'https://your-domain.com',
    },
    openGraph: {
        title: 'JWT & JWE Decoder/Encoder - Privacy-First JWT Tool',
        description:
            'Decode and encode JSON Web Tokens securely in your browser. No data leaves your device.',
        type: 'website',
        url: 'https://your-domain.com',
        siteName: 'JWT Decoder',
        images: [
            {
                url: 'https://your-domain.com/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Screenshot of the JWT & JWE Decoder / Encoder UI',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JWT & JWE Decoder/Encoder',
        description: 'Secure, client-side JWT debugging tool',
        images: ['https://your-domain.com/og-image.png'],
    },
    icons: {
        icon: [
            {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
            {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
            {url: '/favicon.ico', sizes: 'any'}
        ],
        apple: [{url: '/apple-touch-icon.png', sizes: '180x180'}],
        shortcut: ['/favicon.ico'],
        other: [
            {
                rel: 'android-chrome-192x192',
                url: '/android-chrome-192x192.png',
                type: 'image/png',
                sizes: '192x192',
            },
            {
                rel: 'android-chrome-512x512',
                url: '/android-chrome-512x512.png',
                type: 'image/png',
                sizes: '512x512',
            },
        ],
    },
    manifest: '/site.webmanifest',
}

export default function RootLayout({children}: { children: ReactNode }) {
    // JSON-LD structured data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'JWT Decoder',
        description:
            'Free, secure JWT and JWE decoder and encoder. Privacy-first, client-side token debugging.',
        url: 'https://your-domain.com',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    }

    return (
        <html lang="en">
        <head>
            {/* Google tag (gtag.js) */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-KMFXZY72NT"></script>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KMFXZY72NT');
            `,
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </head>
        <body>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics/>
        </body>
        </html>
    )
}