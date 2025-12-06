import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation';
import '../globals.css';
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = 'https://2fa.media-buying.tools';

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'uk' }];
}

export async function generateMetadata(
    { params: { locale } }: { params: { locale: string } }
): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'site' });

    return {
        manifest: '/site.webmanifest',
        metadataBase: new URL(siteUrl),
        title: {
            default: t('title'),
            template: `%s | ${t('name')}`
        },
        description: t('description'),
        keywords: t('keywords').split(',').map(k => k.trim()),
        openGraph: {
            type: 'website',
            locale: locale === 'en' ? 'en_US' : (locale === 'ru' ? 'ru_RU' : 'uk_UA'),
            url: `${siteUrl}/${locale}`,
            siteName: t('name'),
            title: t('title'),
            description: t('description'),
            images: [
                {
                    url: `${siteUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: t('ogAlt'),
                    type: 'image/png'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            images: [`${siteUrl}/og-image.png`]
        },
        alternates: {
            canonical: `${siteUrl}/${locale}`
        },
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: 'any' },
                { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            ],
            apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
        },
        category: 'technology',
        robots: {
            index: true,
            follow: true,
        }
    };
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#020617'
};

export default async function RootLayout({
                                             children,
                                             params: { locale }
                                         }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    let messages;
    try {
        messages = (await import(`../../messages/${locale}.json`)).default;
    } catch {
        notFound();
    }

    return (
        <html lang={locale} className="dark" suppressHydrationWarning>
        <head>
            <link rel="canonical" href={`${siteUrl}/${locale}`} />
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
            <Script
                id="gtm-head"
                strategy="afterInteractive"
            >{`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-5DBPC2PV');
        `}</Script>

        </head>
        <body className={`${inter.className} antialiased bg-neutral-950 text-neutral-50`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
            <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-5DBPC2PV"
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
            />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
