import { TotpGenerator } from '@/components/TotpGenerator'
import Script from 'next/script'

const siteUrl = 'https://totp-generator.example.com'

// JSON-LD Structured Data
const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TOTP Generator',
    description: 'Free, secure, client-side Time-Based One-Time Password (TOTP) generator for two-factor authentication.',
    url: siteUrl,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/?secret={secret}`,
        },
        'query-input': 'required name=secret',
    },
}

const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TOTP Generator',
    description: 'Generate Time-Based One-Time Password (TOTP) codes for two-factor authentication. Secure, private, and runs entirely in your browser.',
    url: siteUrl,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0.0',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'RFC 6238 compliant TOTP generation',
        'Client-side only - no server communication',
        'Base32 secret key support',
        '30-second refresh cycle',
        '6-digit code output',
        'Copy to clipboard functionality',
        'Real-time countdown timer',
        'Dark mode support',
        'Mobile responsive design',
    ],
    screenshot: `${siteUrl}/screenshot.png`,
    potentialAction: {
        '@type': 'UseAction',
        name: 'Generate TOTP Code',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: siteUrl,
            actionPlatform: [
                'http://schema.org/DesktopWebPlatform',
                'http://schema.org/MobileWebPlatform',
            ],
        },
    },
}

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is TOTP?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'TOTP (Time-Based One-Time Password) is a security mechanism that generates temporary codes for two-factor authentication. These codes change every 30 seconds and are based on a shared secret key and the current time.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is this TOTP generator secure?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, this TOTP generator runs entirely in your browser. Your secret key never leaves your device and is not sent to any server. All code generation happens client-side using industry-standard algorithms (RFC 6238).',
            },
        },
        {
            '@type': 'Question',
            name: 'What is a Base32 secret key?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A Base32 secret key is an encoded string provided by services when you set up two-factor authentication. It typically contains uppercase letters A-Z and digits 2-7, and is used to generate your TOTP codes.',
            },
        },
    ],
}

export default function HomePage() {
    return (
        <>
            <Script
                id="website-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <Script
                id="webapp-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
            />
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                            TOTP Generator
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
                            Generate secure 2FA codes instantly
                        </p>
                    </header>

                    {/* Main Card */}
                    <TotpGenerator />

                    {/* Footer Info */}
                    <footer className="mt-8 text-center">
                        <div className="flex flex-col gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <p className="flex items-center justify-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                <span>100% client-side • Your secret never leaves your device</span>
                            </p>
                            <p>
                                RFC 6238 compliant • SHA-1 • 30-second interval • 6 digits
                            </p>
                        </div>
                    </footer>
                </div>

                {/* SEO Content Section */}
                <section className="w-full max-w-2xl mt-16 px-4" aria-label="About TOTP Generator">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                            About TOTP Generator
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            This free TOTP (Time-Based One-Time Password) generator creates secure
                            authentication codes for two-factor authentication (2FA). Compatible with
                            Google Authenticator, Authy, and other TOTP-based systems.
                        </p>

                        <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Key Features
                        </h3>
                        <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1 mb-4">
                            <li>Fully client-side - no data sent to servers</li>
                            <li>RFC 6238 compliant TOTP algorithm</li>
                            <li>Automatic code refresh every 30 seconds</li>
                            <li>Visual countdown timer</li>
                            <li>One-click copy to clipboard</li>
                            <li>Dark mode support</li>
                            <li>Mobile-friendly responsive design</li>
                        </ul>

                        <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            How It Works
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Enter your Base32-encoded secret key (provided by the service you&apos;re
                            authenticating with), and the generator will produce a 6-digit code that
                            refreshes every 30 seconds. The code is generated using the HMAC-SHA1
                            algorithm combined with the current Unix timestamp, ensuring compatibility
                            with standard authenticator apps.
                        </p>
                    </div>
                </section>
            </main>
        </>
    )
}