// app/layout.tsx (оновлена версія)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart-drawer";


const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "PUDRA — Каталог для партнерів | Безшовна білизна, лосини, комбінезони",
    description: "B2B каталог PUDRA Чернігів. Безшовна білизна, лосини, комбінезони, термобілизна за гуртовими цінами. Безкоштовна доставка від 3000₴.",
    keywords: ["безшовна білизна", "лосини", "комбінезони", "термобілизна", "гурт", "Чернігів", "PUDRA"],
    openGraph: {
        title: "PUDRA — Каталог для партнерів",
        description: "Безшовна білизна • лосини • комбінезони • термобілизна",
        url: "https://www.instagram.com/pudra_chernihiv/",
        siteName: "PUDRA",
        locale: "uk_UA",
        type: "profile",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uk" className="scroll-smooth">
        <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <CartProvider>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <CartDrawer />
        </CartProvider>
        </body>
        </html>
    );
}
