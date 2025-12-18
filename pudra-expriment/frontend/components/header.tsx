import Link from "next/link";
import { Package2 } from "lucide-react";

/**
 * Site header with logo and navigation
 * Server Component - renders at build time
 */
export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo and Brand */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Package2 className="h-6 w-6 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            B2B Catalog
          </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        About
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}