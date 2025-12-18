import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { ProductTable } from "@/components/product-table";
import {
    getCategories,
    getProductsByCategory,
    getCategoryBySlug,
    getColumnDefinitions
} from "@/lib/data-loader";

interface CategoryPageProps {
    params: {
        category: string;
    };
}

/**
 * Generate static params for all categories
 * Runs at BUILD TIME to pre-generate all category pages
 */
export async function generateStaticParams() {
    const categories = getCategories();

    return categories.map((category) => ({
        category: category.slug,
    }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = getCategoryBySlug(params.category);

    if (!category) {
        return {
            title: "Category Not Found",
        };
    }

    return {
        title: `${category.name} | B2B Product Catalog`,
        description: `Browse our selection of ${category.name.toLowerCase()} products with wholesale pricing.`,
    };
}

/**
 * Category page - displays all products in a table with search
 * Server Component - data loaded at BUILD TIME only
 */
export default function CategoryPage({ params }: CategoryPageProps) {
    const category = getCategoryBySlug(params.category);

    // Return 404 if category not found
    if (!category) {
        notFound();
    }

    // Load products at build time
    const products = getProductsByCategory(category.originalName);

    // Get column definitions for dynamic rendering
    const columns = getColumnDefinitions(products);

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <section className="border-b bg-gradient-to-br from-primary/5 via-background to-background py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link
                            href="/"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">{category.name}</span>
                    </nav>

                    {/* Page Title */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                {category.name}
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Browse wholesale products with competitive B2B pricing
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2">
                <span className="text-2xl font-bold text-primary">
                  {products.length}
                </span>
                                <span className="text-xs text-muted-foreground">Products</span>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-muted px-4 py-2">
                <span className="text-2xl font-bold">
                  {columns.length - 5}
                </span>
                                <span className="text-xs text-muted-foreground">Extra Fields</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Table Section */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {/* ProductTable is a Client Component for search/expand interactivity */}
                    {/* All data is passed as props (loaded at build time) */}
                    <ProductTable
                        products={products}
                        columns={columns}
                        categoryName={category.name}
                    />
                </div>
            </section>
        </div>
    );
}