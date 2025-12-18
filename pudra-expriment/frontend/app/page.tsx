import { ArrowRight, Package, TrendingUp, Shield, Truck } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { getCategories } from "@/lib/data-loader";
import { Button } from "@/components/ui/button";

/**
 * Головна сторінка — показує всі категорії
 * Server Component — дані завантажуються під час білду
 * Без runtime fetching
 */
export default function HomePage() {
    const categories = getCategories();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20 lg:py-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                <div className="container relative mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
                            <Package className="h-4 w-4 text-primary" />
                            <span>Нам довіряють 500+ партнерів</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            PUDRA — якісні товари за{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                гуртовими цінами
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
                            Каталог для B2B. Швидка доставка. Надійний сервіс.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Button size="lg" className="text-lg">
                                Каталог
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg">
                                Відділ продажу
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-b bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Feature 1 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Висока маржа</h3>
                                <p className="text-sm text-muted-foreground">
                                    Гуртові ціни для вашого прибутку
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Контроль якості</h3>
                                <p className="text-sm text-muted-foreground">
                                    Перевірка кожної партії
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Швидка доставка</h3>
                                <p className="text-sm text-muted-foreground">
                                    Оперативна відправка та доставка
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Широкий вибір</h3>
                                <p className="text-sm text-muted-foreground">
                                    {categories.length} категорій
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Категорії товарів
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Оберіть категорію та перегляньте позиції й ціни.
                        </p>
                    </div>

                    {/* Categories Grid */}
                    {categories.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => (
                                <CategoryCard key={category.slug} category={category} />
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Package className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Категорій поки немає</h3>
                            <p className="text-muted-foreground">
                                Вони з’являться після додавання даних.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t bg-primary py-16 text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Готові почати?</h2>
                    <p className="mb-8 text-lg opacity-90">
                        Напишіть нам — узгодимо ціни та умови.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg">
                        Зв’язатися з продажами
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>
        </div>
    );
}
