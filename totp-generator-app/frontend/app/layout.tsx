import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const siteUrl = 'https://totp-generator.example.com'
const siteName = 'TOTP Generator'
const siteDescription = 'Free, secure, client-side Time-Based One-Time Password (TOTP) generator. Generate 2FA codes instantly with your Base32 secret key. No data sent to servers - 100% private and secure.'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'TOTP Generator - Free & Secure 2FA Code Generator',
        template: '%s | TOTP Generator',
    },
    description: siteDescription,
    keywords: [
        'TOTP',
        'TOTP generator',
        '2FA',
        'two-factor authentication',
        'authenticator',
        'OTP',
        'one-time password',
        'Base32',
        'RFC 6238',
        'security',
        'authentication code',
        'Google Authenticator alternative',
        'free authenticator',
        'client-side TOTP',
        'secure 2FA',
    ],
    authors: [{ name: 'TOTP Generator Team' }],
    creator: 'TOTP Generator',
    publisher: 'TOTP Generator',
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
    alternates: {
        canonical: siteUrl,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: siteName,
        title: 'TOTP Generator - Free & Secure 2FA Code Generator',
        description: siteDescription,
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'TOTP Generator - Generate secure 2FA codes instantly',
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'TOTP Generator - Free & Secure 2FA Code Generator',
        description: siteDescription,
        images: [`${siteUrl}/og-image.png`],
        creator: '@totpgenerator',
        site: '@totpgenerator',
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/site.webmanifest',
    category: 'technology',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#171717' },
    ],
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="canonical" href={siteUrl} />
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        </head>
        <body className={`${inter.className} antialiased`}>
        {children}
        </body>
        </html>
    )
}