// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://cleanpaste.usekit.site"),
    title: "Clean & Paste — Free Invisible Unicode Character Remover | Remove AI Watermarks",
    description:
        "Remove invisible characters from AI-generated text instantly. Free unicode invisible character remover that cleans zero width spaces, byte order marks, and AI watermarks. Just clean and paste.",
    keywords: [
        "remove invisible characters",
        "clean AI text",
        "unicode invisible character remover",
        "zero width character remover",
        "AI watermark remover",
        "free invisible character cleaner",
        "clean and paste",
        "remove hidden characters",
        "unicode cleaner",
        "text sanitizer",
    ],
    authors: [{ name: "Vertex Media Corporation" }],
    creator: "Vertex Media Corporation",
    publisher: "Vertex Media Corporation",
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
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://cleanpaste.usekit.site",
        siteName: "Clean & Paste",
        title: "Clean & Paste — Free Invisible Unicode Character Remover",
        description:
            "Remove invisible characters from AI-generated text instantly. Free tool to clean zero width spaces, byte order marks, and AI watermarks.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Clean & Paste - Invisible Unicode Character Remover",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Clean & Paste — Free Invisible Unicode Character Remover",
        description:
            "Remove invisible characters from AI-generated text instantly. Free unicode cleaner tool.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "https://cleanpaste.usekit.site",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </head>
        <body className={inter.className}>{children}</body>
        </html>
    );
}