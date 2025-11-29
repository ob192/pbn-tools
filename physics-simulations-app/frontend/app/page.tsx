import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORIES, SITE_NAME, SITE_DESCRIPTION } from "@/lib/categories";
import { getAllSimulations } from "@/lib/getSimulationList";
import { Sparkles, PlayCircle, Gauge, Users } from "lucide-react";
import InterferenceSimulation from "@/components/simulations/InterferenceSimulation";

export default function Home() {
    const simulations = getAllSimulations();
    const totalSimulations = simulations.length;

    // Pick a few simulations to feature on the homepage
    const featuredSimulations = simulations.slice(0, 3);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🔬</span>
                        <span className="text-xl font-bold tracking-tight">
              {SITE_NAME}
            </span>
                    </Link>
                    <nav className="hidden items-center space-x-4 text-sm md:flex">
                        <Link
                            href="/simulations"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Simulations
                        </Link>
                        <Link
                            href="/simulations/mechanics/pendulum"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Pendulum demo
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                {/* HERO */}
                <section className="container mx-auto px-4 py-12 md:py-20">
                    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
                        {/* Hero text */}
                        <div className="space-y-6 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                                <Sparkles className="h-3 w-3" />
                                Built for curious minds – kids & adults
                            </div>

                            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                Interactive{" "}
                                <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  Physics Simulations
                </span>
                                , right in your browser.
                            </h1>

                            <p className="mx-auto max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
                                {SITE_DESCRIPTION}. Explore mechanics, waves, optics, and more
                                through hands-on interactive experiments designed for classrooms,
                                self-learners, and playful exploration.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                <Button asChild size="lg" className="gap-2">
                                    <Link href="/simulations">
                                        <PlayCircle className="h-5 w-5" />
                                        Explore simulations
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/simulations/mechanics/pendulum">
                                        Try pendulum demo
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground md:justify-start">
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    Runs in the browser – nothing to install
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                    Optimized for laptops, tablets & phones
                                </div>
                            </div>
                        </div>

                        {/* Hero preview card */}
                        <div className="relative mx-auto w-full max-w-md">
                            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/10 via-emerald-500/5 to-transparent blur-2xl" />
                            <div className="relative rounded-3xl border bg-card/80 p-4 shadow-lg shadow-black/5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Live preview
                                        </p>
                                        <p className="text-sm font-semibold">
                                            Two-source interference
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    60 FPS
                  </span>
                                </div>
                                <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
                                    <InterferenceSimulation
                                        variant="preview"
                                        linkTo="/simulations/waves/interference"
                                    />
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">
                                    Move the sources, change the wavelength, and watch bright and
                                    dark fringes appear in real time.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS / VALUE PROPS */}
                <section className="container mx-auto px-4 pb-8 md:pb-12">
                    <div className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-4">
                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                                <Gauge className="h-4 w-4 text-primary" />
                                Library
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {totalSimulations}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Interactive simulations across core physics topics.
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Topics
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {CATEGORIES.length}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                From mechanics and waves to fields and optics.
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                                <PlayCircle className="h-4 w-4 text-primary" />
                                Smooth
                            </div>
                            <div className="text-3xl font-bold text-primary">60</div>
                            <div className="text-xs text-muted-foreground">
                                Frames per second on modern devices for fluid motion.
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-5 shadow-sm">
                            <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                                <Users className="h-4 w-4 text-primary" />
                                For everyone
                            </div>
                            <div className="text-3xl font-bold text-primary">100%</div>
                            <div className="text-xs text-muted-foreground">
                                Built for kids, students, teachers, and lifelong learners.
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURED SIMULATIONS */}
                {featuredSimulations.length > 0 && (
                    <section className="container mx-auto px-4 py-8 md:py-12">
                        <div className="mb-6 flex flex-col items-center justify-between gap-3 md:flex-row">
                            <div className="space-y-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Featured simulations
                                </h2>
                                <p className="max-w-xl text-sm text-muted-foreground">
                                    Jump straight into some of the most popular or visually
                                    striking experiments. Every simulation comes with an explainer
                                    article in plain language.
                                </p>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/simulations">Browse all simulations</Link>
                            </Button>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {featuredSimulations.map((sim) => (
                                <Link
                                    key={`${sim.category}-${sim.slug}`}
                                    href={`/simulations/${sim.category}/${sim.slug}`}
                                    className="group flex flex-col rounded-xl border bg-card/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                                >
                                    <div className="mb-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                      {sim.category}
                    </span>
                                        <span className="h-1 w-1 rounded-full bg-border" />
                                        <span>{sim.readTime ?? "Interactive demo"}</span>
                                    </div>
                                    <h3 className="mb-1 text-sm font-semibold md:text-base group-hover:text-primary">
                                        {sim.title}
                                    </h3>
                                    <p className="line-clamp-3 text-xs text-muted-foreground md:text-sm">
                                        {sim.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                                        <span>Open simulation</span>
                                        <span aria-hidden>→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* CATEGORIES */}
                <section className="container mx-auto px-4 py-10 md:py-14">
                    <h2 className="mb-4 text-center text-2xl font-bold tracking-tight md:text-3xl">
                        Explore by category
                    </h2>
                    <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
                        Whether you are learning the basics of motion or diving into wave
                        interference, start with a category that matches your curiosity.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {CATEGORIES.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/simulations/${category.slug}`}
                                className="group relative flex flex-col rounded-xl border bg-card/80 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-2xl">
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold group-hover:text-primary md:text-lg">
                                                {category.name}
                                            </h3>
                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                Physics category
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Browse →
                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {category.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-10 border-t">
                <div className="container mx-auto px-4 py-8 text-center text-xs text-muted-foreground md:text-sm">
                    <p>
                        © {new Date().getFullYear()} {SITE_NAME}. Built for learning and
                        exploration.
                    </p>
                </div>
            </footer>
        </div>
    );
}
