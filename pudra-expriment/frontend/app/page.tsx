// app/page.tsx
import { ArrowDown, Package, TrendingUp, Shield, Truck, Instagram } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { getCategories } from "@/lib/data-service";

export const revalidate = 3600;

export default async function HomePage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20 lg:py-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                <div className="container relative mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
                            <Package className="h-4 w-4 text-primary" />
                            <span>Нам довіряють 500+ партнерів</span>
                        </div>

                        {/* Heading */}
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            PUDRA — якісні товари за{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                гуртовими цінами
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mb-4 text-lg text-muted-foreground sm:text-xl">
                            безшовна білизна • лосини • комбінезони • термобілизна
                        </p>
                        <p className="mb-10 text-base text-muted-foreground">
                            Безкоштовна доставка від 3000₴ • Відправка в день оплати 🚘
                        </p>

                        {/* Instagram CTA */}
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://www.instagram.com/pudra_chernihiv/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                            >
                                <Instagram className="h-5 w-5" />
                                Instagram
                            </a>
                            <a
                                href="https://www.threads.com/@pudra_chernihiv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-8 py-3 text-lg font-medium shadow transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Threads
                            </a>
                        </div>

                        {/* Scroll hint */}
                        <div className="mt-12 flex flex-col items-center gap-2 text-muted-foreground sm:hidden animate-bounce">
                            <span className="text-sm">Пролистніть вниз</span>
                            <ArrowDown className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-b bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <Feature
                            icon={<TrendingUp className="h-6 w-6" />}
                            title="Висока маржа"
                            text="Гуртові ціни для вашого прибутку"
                        />
                        <Feature
                            icon={<Shield className="h-6 w-6" />}
                            title="Контроль якості"
                            text="Перевірка кожної партії"
                        />
                        <Feature
                            icon={<Truck className="h-6 w-6" />}
                            title="Швидка доставка"
                            text="Відправка в день оплати"
                        />
                        <Feature
                            icon={<Package className="h-6 w-6" />}
                            title="Широкий вибір"
                            text={`${categories.length} категорій товарів`}
                        />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                            Категорії товарів
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Оберіть категорію та перегляньте позиції й ціни
                        </p>
                    </div>

                    {categories.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                Категорій поки немає
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    );
}