// File: app/simulations/page.tsx
import Link from "next/link";
import type {Metadata} from "next";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import {
    getSimulationsByCategory,
    getAllSimulations,
} from "@/lib/getSimulationList";
import {CATEGORIES, SITE_NAME} from "@/lib/categories";

export const metadata: Metadata = {
    title: "All Simulations",
    description: "Browse all interactive physics simulations by category",
};

export default function SimulationsPage() {
    const groupedSimulations = getSimulationsByCategory();
    const allSimulations = getAllSimulations();

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
                    <div className="mx-auto flex max-w-5xl flex-col gap-8">
                        {/* Page intro */}
                        <section>
                            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                                All simulations
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Explore {allSimulations.length} interactive physics simulations
                                across {CATEGORIES.length} categories. Choose a topic below to
                                jump into hands-on experiments with guided explanations.
                            </p>
                        </section>

                        {/* Category sections */}
                        <section className="space-y-8 sm:space-y-10">
                            {CATEGORIES.map((category) => {
                                const simulations = groupedSimulations[category.slug] || [];
                                const count = simulations.length;

                                return (
                                    <div
                                        key={category.slug}
                                        className="rounded-2xl border bg-card/70 p-4 shadow-sm sm:p-5 lg:p-6"
                                    >
                                        {/* Category header */}
                                        <div
                                            className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                                            <Link
                                                href={`/simulations/${category.slug}`}
                                                className="group inline-flex items-center gap-3"
                                            >
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                                    {category.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-base font-semibold tracking-tight group-hover:text-primary sm:text-lg">
                                                        {category.name}
                                                    </h2>
                                                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                        Physics category
                                                    </p>
                                                </div>
                                            </Link>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5">
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary"/>
                            {count > 0
                                ? `${count} simulation${count > 1 ? "s" : ""}`
                                : "Coming soon"}
                        </span>
                                            </div>
                                        </div>

                                        <p className="mb-4 text-sm text-muted-foreground">
                                            {category.description}
                                        </p>

                                        {/* Simulation list */}
                                        {simulations.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {simulations.map((sim) => (
                                                    <Link
                                                        key={sim.slug}
                                                        href={`/simulations/${category.slug}/${sim.slug}`}
                                                        className="group flex flex-col rounded-xl border bg-card/80 p-4 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                                                    >
                                                        <div className="mb-1 flex items-start justify-between gap-2">
                                                            <h3 className="text-sm font-semibold leading-snug sm:text-base">
                                                                {sim.title}
                                                            </h3>
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
                                        ) : (
                                            <p className="text-sm italic text-muted-foreground">
                                                Simulations coming soon for this topic.
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
