// File: app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/categories";
import { generateWebsiteJsonLd } from "@/lib/generateJsonLd";
import "katex/dist/katex.min.css";

const inter = Inter({ subsets: ["latin"] });

// 1. Setup Base URL
// Use the environment variable in production, or localhost in development
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";

// 2. Define Full Metadata for SEO
export const metadata: Metadata = {
    // Critical for resolving relative social image URLs
    metadataBase: new URL(BASE_URL),

    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`, // Example: "Pendulum | Physics Simulations"
    },
    description: SITE_DESCRIPTION,

    keywords: [
        "Physics",
        "Simulations",
        "Interactive Learning",
        "STEM",
        "Science Education",
        "Mechanics",
        "Waves",
        "Optics"
    ],

    authors: [{ name: "Physics Sim Team", url: BASE_URL }],
    creator: "Physics Sim Team",
    publisher: "Physics Sim Team",

    // Canonical URL handling to prevent duplicate content issues
    alternates: {
        canonical: "/",
        languages: {
            "en-US": "/en-US",
        },
    },

    // Open Graph (Facebook, LinkedIn, Discord, etc.)
    openGraph: {
        type: "website",
        locale: "en_US",
        url: BASE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: "/og-image.png", // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },

    // Twitter Card configuration
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        images: ["/og-image.png"],
        creator: "@yourtwitterhandle", // Optional: Add your handle
    },

    // Robot crawling directives
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

    // App icons
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    // Link to the generated sitemap
    manifest: `${BASE_URL}/manifest.json`, // Optional PWA manifest
};

// 3. Viewport settings (Separate export in Next.js 14)
export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    // Generate the Organization/WebSite structured data
    const websiteJsonLd = generateWebsiteJsonLd();

    return (
        <html lang="en" className="dark">
        <head>
            {/* Inject JSON-LD for Google Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
        </head>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    );
}