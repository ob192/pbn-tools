'use client';

import { TotpGenerator } from '@/components/TotpGenerator';
import Script from 'next/script';
import { useTranslations, useLocale } from 'next-intl';

const siteUrl = 'https://2fa.media-buying.tools';

export default function HomePage() {
    const tSite = useTranslations('site');
    const tHome = useTranslations('home');
    const tWebapp = useTranslations('webapp');
    const tFaq = useTranslations('faq');
    const locale = useLocale();

    // Map Next locale to language code for JSON-LD
    const inLanguage =
        locale === 'ru' ? 'ru' :
            locale === 'uk' ? 'uk' :
                'en';

    // Localized Website schema
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: tSite('name'),                    // site.name
        description: tSite('description'),      // site.description
        inLanguage,
        url: siteUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/?secret={secret}`,
            },
            'query-input': 'required name=secret',
        },
    };

    // Localized WebApplication schema
    const webApplicationSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tWebapp('name'),                  // webapp.name
        description: tWebapp('description'),    // webapp.description
        url: siteUrl,
        applicationCategory: tWebapp('category'), // e.g. "SecurityApplication"
        operatingSystem: 'Any',
        inLanguage,
        browserRequirements: 'Requires JavaScript',
        softwareVersion: '1.0.0',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        featureList: [
            tWebapp('feature1'),
            tWebapp('feature2'),
            tWebapp('feature3'),
            tWebapp('feature4'),
            tWebapp('feature5'),
            tWebapp('feature6'),
            tWebapp('feature7'),
            tWebapp('feature8'),
        ],
        screenshot: `${siteUrl}/screenshot.png`,
        potentialAction: {
            '@type': 'UseAction',
            name: tWebapp('actionName'),        // e.g. "Generate 2FA Code"
            target: {
                '@type': 'EntryPoint',
                urlTemplate: siteUrl,
                actionPlatform: [
                    'http://schema.org/DesktopWebPlatform',
                    'http://schema.org/MobileWebPlatform',
                ],
            },
        },
    };

    // Localized FAQ schema
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: tFaq('q1.question'),
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: tFaq('q1.answer'),
                },
            },
            {
                '@type': 'Question',
                name: tFaq('q2.question'),
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: tFaq('q2.answer'),
                },
            },
            {
                '@type': 'Question',
                name: tFaq('q3.question'),
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: tFaq('q3.answer'),
                },
            },
            {
                '@type': 'Question',
                name: tFaq('q4.question'),
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: tFaq('q4.answer'),
                },
            },
        ],
    };

    return (
        <>
            {/* JSON-LD: website, webapp, FAQ */}
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

            <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-50 flex flex-col items-center px-4 py-8 sm:px-5 sm:py-10">
                <div className="w-full max-w-xl">

                    {/* Hero */}
                    <header className="mb-8 sm:mb-10 text-center space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900/80 border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300 shadow-sm">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {tHome('badge')} {/* home.badge */}
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                                {tHome('headline')} {/* home.headline */}
                            </h1>
                            <p className="text-sm sm:text-base text-neutral-400">
                                {tHome('subheadline')} {/* home.subheadline */}
                            </p>
                        </div>
                    </header>

                    {/* Main Tool */}
                    <TotpGenerator />

                    {/* Footer */}
                    <footer className="mt-6 sm:mt-8 text-center space-y-2 text-xs text-neutral-500">
                        <p className="flex items-center justify-center gap-2">
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
                            <span>{tHome('footerSecurity')}</span>
                            {/* home.footerSecurity, e.g. "Your secret stays in your browser—never uploaded or stored." */}
                        </p>
                        <p>{tHome('footerSpecs')}</p>
                        {/* home.footerSpecs, e.g. "RFC 6238 · SHA-1 · 30-second interval · 6-digit 2FA codes" */}
                    </footer>
                </div>

                {/* SEO / Info Section */}
                <section
                    className="w-full max-w-xl mt-10 sm:mt-12 px-1 sm:px-0"
                    aria-label={tHome('seoSectionAria')}
                >
                    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-5 sm:px-6 sm:py-6">
                        <div className="space-y-6">
                            {/* About */}
                            <div className="space-y-2">
                                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                                    {tHome('seoSectionAria')}
                                </p>
                                <h2 className="text-lg sm:text-xl font-semibold text-neutral-50">
                                    {tHome('aboutTitle')}
                                </h2>
                                <p className="text-sm sm:text-[0.95rem] leading-relaxed text-neutral-400">
                                    {tHome('aboutText')}
                                </p>
                            </div>

                            <hr className="border-neutral-800/80" />

                            {/* Features */}
                            <div className="space-y-3">
                                <h3 className="text-sm sm:text-base font-medium text-neutral-100">
                                    {tHome('featuresTitle')}
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-400">
                                    <li className="leading-snug">• {tHome('feature1')}</li>
                                    <li className="leading-snug">• {tHome('feature2')}</li>
                                    <li className="leading-snug">• {tHome('feature3')}</li>
                                    <li className="leading-snug">• {tHome('feature4')}</li>
                                    <li className="leading-snug">• {tHome('feature5')}</li>
                                    <li className="leading-snug">• {tHome('feature6')}</li>
                                    <li className="leading-snug sm:col-span-2">• {tHome('feature7')}</li>
                                </ul>
                            </div>

                            <hr className="border-neutral-800/80" />

                            {/* How it works */}
                            <div className="space-y-2">
                                <h3 className="text-sm sm:text-base font-medium text-neutral-100">
                                    {tHome('howTitle')}
                                </h3>
                                <p className="text-sm sm:text-[0.95rem] leading-relaxed text-neutral-400">
                                    {tHome('howText')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}
