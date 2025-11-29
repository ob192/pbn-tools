import Link from "next/link";
import {notFound} from "next/navigation";
import type {Metadata} from "next";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import {
    getSimulationsByCategory,
    getCategorySimulations,
    generateCategoryParams,
} from "@/lib/getSimulationList";
import {CATEGORIES, SITE_NAME, SITE_URL} from "@/lib/categories";

interface CategoryPageProps {
    params: { category: string };
}

export function generateStaticParams() {
    return generateCategoryParams();
}

export async function generateMetadata({
                                           params,
                                       }: CategoryPageProps): Promise<Metadata> {
    const category = CATEGORIES.find((c) => c.slug === params.category);

    if (!category) {
        return {title: "Category Not Found"};
    }

    return {
        title: `${category.name} Simulations`,
        description: category.description,
        openGraph: {
            title: `${category.name} Simulations | ${SITE_NAME}`,
            description: category.description,
            url: `${SITE_URL}/simulations/${params.category}`,
        },
    };
}

export default function CategoryPage({params}: CategoryPageProps) {
    const category = CATEGORIES.find((c) => c.slug === params.category);

    if (!category) {
        notFound();
    }

    const groupedSimulations = getSimulationsByCategory();
    const simulations = getCategorySimulations(params.category);
    const count = simulations.length;

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
            {/* Desktop sidebar */}
            <Sidebar groupedSimulations={groupedSimulations}/>

            <div className="flex min-h-screen flex-1 flex-col">
                {/* Mobile header */}
                <header
                    className="sticky top-0 z-20 flex items-center gap-4 border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
                    <MobileSidebar groupedSimulations={groupedSimulations}/>
                    <Link href="/" className="font-semibold tracking-tight">
                        {SITE_NAME}
                    </Link>
                </header>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
                    <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:gap-8">
                        {/* Breadcrumbs */}
                        <nav className="text-xs text-muted-foreground sm:text-sm">
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                            <span className="mx-1">/</span>
                            <Link
                                href="/simulations"
                                className="hover:text-foreground"
                            >
                                Simulations
                            </Link>
                            <span className="mx-1">/</span>
                            <span className="text-foreground">{category.name}</span>
                        </nav>

                        {/* Category header card */}
                        <section className="rounded-2xl border bg-card/70 p-4 shadow-sm sm:p-6 lg:p-7">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-3xl">
                                        {category.icon}
                                    </div>
                                    <div>
                                        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                                            {category.name} simulations
                                        </h1>
                                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary"/>
                      {count > 0
                          ? `${count} simulation${count > 1 ? "s" : ""}`
                          : "Simulations coming soon"}
                  </span>
                                </div>
                            </div>
                        </section>

                        {/* Simulation list / empty state */}
                        {simulations.length > 0 ? (
                            <section className="space-y-3">
                                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
                                    Simulations in {category.name}
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {simulations.map((sim) => (
                                        <Link
                                            key={sim.slug}
                                            href={`/simulations/${params.category}/${sim.slug}`}
                                            className="group flex flex-col rounded-xl border bg-card/80 p-4 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                                        >
                                            <div className="mb-1 flex items-start justify-between gap-2">
                                                <h2 className="text-sm font-semibold leading-snug sm:text-base group-hover:text-primary">
                                                    {sim.title}
                                                </h2>
                                                {sim.readTime && (
                                                    <span
                                                        className="whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {sim.readTime}
                          </span>
                                                )}
                                            </div>
                                            <p className="line-clamp-3 text-xs text-muted-foreground sm:text-sm">
                                                {sim.description}
                                            </p>
                                            <div
                                                className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                                                <span>Open simulation</span>
                                                <span aria-hidden>→</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section
                                className="flex flex-1 items-center justify-center rounded-2xl border bg-card/70 p-10 text-center">
                                <div>
                                    <div className="mb-3 text-3xl">🚧</div>
                                    <p className="text-sm text-muted-foreground sm:text-base">
                                        Simulations for this category are coming soon. Check back
                                        later, or explore another topic from the sidebar.
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
