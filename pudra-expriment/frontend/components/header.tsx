// components/header.tsx
"use client";

import Link from "next/link";
import { Package2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
    const { items, openCart } = useCart();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo and Brand */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Package2 className="h-6 w-6 text-primary" />
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        PUDRA
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden sm:inline"
                    >
                        Категорії
                    </Link>
                    <a
                        href="https://www.instagram.com/pudra_chernihiv/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary hidden sm:inline"
                    >
                        Instagram
                    </a>

                    {/* Cart Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={openCart}
                        className="relative"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {totalItems > 0 && (
                            <Badge
                                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                variant="destructive"
                            >
                                {totalItems}
                            </Badge>
                        )}
                        <span className="ml-2 hidden sm:inline">Кошик</span>
                    </Button>
                </nav>
            </div>
        </header>
    );
}