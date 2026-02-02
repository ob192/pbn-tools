// app/category/[category]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { ProductTable } from "@/components/product-table";
import {
    getCategories,
    getCategoryBySlug,
    getProductsByCategory,
    getColumnDefinitions,
    getCategoryStats,
} from "@/lib/data-service"; // ⬅️ CHANGE THIS from data-loader to data-service

interface CategoryPageProps {
    params: {
        category: string;
    };
}

// Revalidate every hour
export const revalidate = 3600;

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
    const categories = await getCategories(); // ⬅️ ADD await

    return categories.map((category) => ({
        category: category.slug,
    }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = await getCategoryBySlug(params.category);

    if (!category) {
        return {
            title: "Category Not Found",
        };
    }

    return {
        title: `${category.name} | B2B Product Catalog`,
        description: category.description || `Browse our selection of ${category.name.toLowerCase()} products with wholesale pricing.`,
    };
}

/**
 * Category page - displays all products in a table with search
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
    const category = await getCategoryBySlug(params.category);

    if (!category) {
        notFound();
    }

    // Load products and stats in parallel
    const [{ products, total }, columns, stats] = await Promise.all([
        getProductsByCategory(params.category),
        getColumnDefinitions(params.category),
        getCategoryStats(params.category),
    ]);

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
                            {category.description && (
                                <p className="mt-2 text-muted-foreground">
                                    {category.description}
                                </p>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex flex-col items-center rounded-lg bg-primary/10 px-4 py-2">
                                <span className="text-2xl font-bold text-primary">
                                    {stats?.totalProducts || 0}
                                </span>
                                <span className="text-xs text-muted-foreground">Products</span>
                            </div>
                            {stats?.avgWholesale && (
                                <div className="flex flex-col items-center rounded-lg bg-muted px-4 py-2">
                                    <span className="text-2xl font-bold">
                                        ${Number(stats.avgWholesale).toFixed(2)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Avg Price</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Table Section */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <ProductTable
                        products={products}
                        columns={columns}
                        categoryName={category.name}
                        totalCount={total}
                    />
                </div>
            </section>
        </div>
    );
}