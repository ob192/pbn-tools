import type {Metadata} from "next";
import {Inter, Space_Grotesk} from "next/font/google";
import "./globals.css";
import Script from "next/script";


const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space",
    display: "swap",
});

if (process.env.NEXT_PUBLIC_BASE_URL === undefined) {
    process.exit(1);
}
const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Build Your Markdown CV in Under 1 Minute | Free, Mobile-First, ATS-Friendly",
        template: "%s | Markdown CV Builder",
    },
    description:
        "Free Markdown CV builder designed for mobile. Create ATS-friendly resumes in under 1 minute. No sign-up, no uploads, runs locally in your browser.",
    keywords: [
        "markdown cv builder",
        "markdown resume builder",
        "ATS-friendly resume",
        "mobile cv builder",
        "cv from phone",
        "1 minute resume",
        "free cv builder",
        "resume builder no sign up",
        "local resume builder",
        "privacy resume builder",
        "markdown to pdf resume",
        "ats resume builder",
    ],
    authors: [{name: "Markdown CV Builder"}],
    creator: "Markdown CV Builder",
    publisher: "Markdown CV Builder",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "Markdown CV Builder",
        title: "Build Your Markdown CV in Under 1 Minute",
        description:
            "Free, mobile-first resume builder. ATS-friendly output, instant PDF export, no sign-up, no uploads. Your CV never leaves your device.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Markdown CV Builder - Build ATS-friendly resumes from your phone",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Build Your Markdown CV in Under 1 Minute",
        description:
            "Free, mobile-first, ATS-friendly. No sign-up, no uploads, runs locally.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "/",
    },
    category: "productivity",
    applicationName: "Markdown CV Builder",
    appleWebApp: {
        capable: true,
        title: "CV Builder",
        statusBarStyle: "default",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${spaceGrotesk.variable}`}
        >
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
            <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="theme-color" content="#10b981"/>
            <meta name="mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />
            <head>
                {/* Google tag (gtag.js) */}
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-3WGLQKZJCR"
                />
                <Script id="gtag-init">
                    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3WGLQKZJCR');
    `}
                </Script>
            </head>

        </head>
        <body className="bg-white text-gray-900 antialiased">
        {children}

        {/* Structured Data - WebApplication */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    name: "Markdown CV Builder",
                    url: baseUrl,
                    description:
                        "Free Markdown CV builder. Build ATS-friendly resumes in under 1 minute from your phone.",
                    applicationCategory: "BusinessApplication",
                    operatingSystem: "Any",
                    browserRequirements:
                        "Requires JavaScript. Modern browser required.",
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD",
                    },
                    featureList: [
                        "Mobile-first design",
                        "ATS-friendly single-column output",
                        "Instant preview",
                        "PDF export",
                        "No sign-up required",
                        "Runs locally in browser",
                        "No uploads or tracking",
                        "Markdown editing",
                    ],
                }),
            }}
        />

        {/* Structured Data - FAQ */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: [
                        {
                            "@type": "Question",
                            name: "Is this Markdown CV builder really free?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Yes. This is a completely free Markdown resume builder. There are no accounts, subscriptions, watermarks, or export limits. You can create and download your CV as many times as you want.",
                            },
                        },
                        {
                            "@type": "Question",
                            name: "How can I build a CV in under 1 minute?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "The editor is designed for speed. You write your CV in simple Markdown, preview it instantly, and export a clean PDF directly from your browser. No templates to fight, no formatting tools to configure.",
                            },
                        },
                        {
                            "@type": "Question",
                            name: "Is a Markdown CV ATS-friendly?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Yes. Markdown resumes produce clean, single-column layouts with predictable structure — exactly what Applicant Tracking Systems (ATS) are built to parse. No columns, no visual tricks, no broken text order.",
                            },
                        },
                        {
                            "@type": "Question",
                            name: "Can I really create my CV from my phone?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Absolutely. The editor is mobile-first and works on modern smartphones and tablets. You can write, preview, and export your CV directly from your phone without installing anything.",
                            },
                        },
                        {
                            "@type": "Question",
                            name: "Does my CV get uploaded or stored anywhere?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "No. Everything runs locally in your browser. Your CV never leaves your device, and nothing is stored on a server. This tool does not track, save, or analyze your data.",
                            },
                        },
                        {
                            "@type": "Question",
                            name: "Why not use a two-column or designed resume template?",
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: "Multi-column resumes often break when parsed by ATS software. Content can be read out of order or skipped entirely. A clean, single-column Markdown resume gives you the best chance of reaching a human reviewer.",
                            },
                        },
                    ],
                }),
            }}
        />
        </body>
        </html>
    );
}