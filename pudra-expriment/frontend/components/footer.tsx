// components/footer.tsx
import Link from "next/link";
import { Package2, Instagram, MapPin, Clock } from "lucide-react";

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
                            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                PUDRA
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Безшовна білизна • лосини • комбінезони • термобілизна
                        </p>
                        <a
                            href="https://www.instagram.com/pudra_chernihiv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Instagram className="h-4 w-4" />
                            @pudra_chernihiv
                        </a>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Навігація</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                    Головна
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/pudra_chernihiv/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.threads.com/@pudra_chernihiv"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    Threads
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Контакти</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>вул. Полуботка, 12, Чернігів 14000</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>10:00–19:00 щодня</span>
                            </li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Умови</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>✓ Безкоштовна доставка від 3000₴</li>
                            <li>✓ Накладений платіж</li>
                            <li>✓ Можливість обміну</li>
                            <li>✓ Відправка в день оплати 🚘</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>© {currentYear} PUDRA Чернігів. Всі права захищені.</p>
                </div>
            </div>
        </footer>
    );
}