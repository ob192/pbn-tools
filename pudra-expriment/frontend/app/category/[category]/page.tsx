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
} from "@/lib/data-service";
import {cn} from "@/lib/utils";

interface CategoryPageProps {
    params: {
        category: string;
    };
    searchParams: {
        page?: string;
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
export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
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
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const category = await getCategoryBySlug(params.category);

    if (!category) {
        notFound();
    }

    const page = parseInt(searchParams.page || '1', 10);
    const pageSize = 20; // Adjust as needed

    // Load products and stats in parallel
    const [{ products, total }, columns, stats] = await Promise.all([
        getProductsByCategory(params.category, undefined, { page, pageSize }),
        getColumnDefinitions(params.category),
        getCategoryStats(params.category),
    ]);

    const totalPages = Math.ceil(total / pageSize);

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
                            {/*{stats?.avgWholesale && (*/}
                            {/*    <div className="flex flex-col items-center rounded-lg bg-muted px-4 py-2">*/}
                            {/*        <span className="text-2xl font-bold">*/}
                            {/*            ${Number(stats.avgWholesale).toFixed(2)}*/}
                            {/*        </span>*/}
                            {/*        <span className="text-xs text-muted-foreground">Середня ціна</span>*/}
                            {/*    </div>*/}
                            {/*)}*/}
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
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-8 px-4">
                        {page > 1 && (
                            <Link
                                href={`/category/${params.category}?page=${page - 1}`}
                                className="px-3 py-2 rounded-md border hover:bg-muted transition-colors text-sm"
                            >
                                ←
                            </Link>
                        )}

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => {
                                    if (totalPages <= 5) return true;
                                    if (p === 1 || p === totalPages) return true;
                                    if (Math.abs(p - page) <= 1) return true;
                                    return false;
                                })
                                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                                        acc.push('...');
                                    }
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, idx) =>
                                        p === '...' ? (
                                            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-muted-foreground">
                            …
                        </span>
                                        ) : (
                                            <Link
                                                key={p}
                                                href={`/category/${params.category}?page=${p}`}
                                                className={cn(
                                                    "min-w-[36px] h-9 flex items-center justify-center rounded-md text-sm transition-colors",
                                                    page === p
                                                        ? "bg-primary text-primary-foreground"
                                                        : "border hover:bg-muted"
                                                )}
                                            >
                                                {p}
                                            </Link>
                                        )
                                )}
                        </div>

                        {page < totalPages && (
                            <Link
                                href={`/category/${params.category}?page=${page + 1}`}
                                className="px-3 py-2 rounded-md border hover:bg-muted transition-colors text-sm"
                            >
                                →
                            </Link>
                        )}
                    </div>
                )}
                {/* End Pagination */}

            </section>
        </div>
    );
}