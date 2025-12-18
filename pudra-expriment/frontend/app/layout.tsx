import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "B2B Product Catalog | Wholesale Products",
    description: "Browse our comprehensive catalog of wholesale products with competitive pricing for B2B buyers.",
    keywords: ["wholesale", "B2B", "catalog", "products", "bulk pricing"],
};

/**
 * Root layout component
 * Wraps all pages with header and footer
 * Server Component - renders at build time
 */
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Header />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}