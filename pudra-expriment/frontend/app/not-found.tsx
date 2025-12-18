import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 page
 * Shown when a page is not found
 */
export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <span className="text-9xl font-bold text-primary/20">
                        404
                    </span>
                </div>

                {/* Message */}
                <h1 className="mb-4 text-3xl font-bold">
                    Page Not Found
                </h1>
                <p className="mb-8 max-w-md text-muted-foreground">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    The page may have been moved or doesn&apos;t exist.
                </p>

                {/* Actions */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/">
                        <Button size="lg">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg">
                            <Search className="mr-2 h-4 w-4" />
                            Browse Categories
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
