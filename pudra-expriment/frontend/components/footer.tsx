import { Package2 } from "lucide-react";

/**
 * Site footer with company info
 * Server Component - renders at build time
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <Package2 className="h-5 w-5 text-primary" />
                            <span>B2B Catalog</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your trusted wholesale partner for quality products at competitive prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="/" className="hover:text-primary transition-colors">Categories</a></li>
                            <li><a href="/" className="hover:text-primary transition-colors">New Arrivals</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/" className="hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="/" className="hover:text-primary transition-colors">FAQs</a></li>
                            <li><a href="/" className="hover:text-primary transition-colors">Shipping Info</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Contact</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>info@b2bcatalog.com</li>
                            <li>+1 (555) 123-4567</li>
                            <li>Mon - Fri: 9AM - 6PM EST</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {currentYear} B2B Catalog. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}