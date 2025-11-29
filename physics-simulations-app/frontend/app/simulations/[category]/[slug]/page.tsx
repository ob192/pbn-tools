// File: app/simulations/[category]/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import MobileSidebar from "@/components/MobileSidebar";
import Article from "@/components/Article";
import SimulationContainer from "@/components/SimulationContainer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { getSimulationData } from "@/lib/getMarkdown";
import { getSimulationsByCategory, generateStaticParams as genParams } from "@/lib/getSimulationList";
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/generateJsonLd";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/categories";

interface SimulationPageProps {
    params: { category: string; slug: string };
}

export function generateStaticParams() {
    return genParams();
}

export async function generateMetadata({ params }: SimulationPageProps): Promise<Metadata> {
    const data = await getSimulationData(params.category, params.slug);

    if (!data) {
        return { title: "Simulation Not Found" };
    }

    const { frontmatter } = data;
    const url = `${SITE_URL}/simulations/${params.category}/${params.slug}`;
    const imageUrl = frontmatter.image || `${SITE_URL}/images/og/${params.slug}.png`;

    return {
        title: frontmatter.title,
        description: frontmatter.description,
        authors: [{ name: frontmatter.author }],
        keywords: frontmatter.tags,
        openGraph: {
            title: frontmatter.title,
            description: frontmatter.description,
            url,
            type: "article",
            publishedTime: frontmatter.date,
            authors: [frontmatter.author],
            tags: frontmatter.tags,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: frontmatter.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: frontmatter.title,
            description: frontmatter.description,
            images: [imageUrl],
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function SimulationPage({ params }: SimulationPageProps) {
    const data = await getSimulationData(params.category, params.slug);

    if (!data) {
        notFound();
    }

    const { frontmatter, content } = data;
    const groupedSimulations = getSimulationsByCategory();
    const category = CATEGORIES.find((c) => c.slug === params.category);

    const articleJsonLd = generateArticleJsonLd(frontmatter, params.category, params.slug);
    const breadcrumbJsonLd = generateBreadcrumbJsonLd(
        params.category,
        category?.name || params.category,
        frontmatter.title,
        params.slug
    );

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <div className="flex min-h-screen">
                <Sidebar groupedSimulations={groupedSimulations} />

                <div className="flex-1 flex flex-col">
                    <header className="lg:hidden border-b p-4 flex items-center gap-4">
                        <MobileSidebar groupedSimulations={groupedSimulations} />
                        <Link href="/" className="font-bold">{SITE_NAME}</Link>
                    </header>

                    <main className="flex-1 p-6 md:p-8 lg:p-12">
                        <div className="max-w-4xl mx-auto">
                            <nav className="text-sm text-muted-foreground mb-6">
                                <Link href="/" className="hover:text-foreground">Home</Link>
                                {" / "}
                                <Link href="/simulations" className="hover:text-foreground">Simulations</Link>
                                {" / "}
                                <Link href={`/simulations/${params.category}`} className="hover:text-foreground">
                                    {category?.name || params.category}
                                </Link>
                                {" / "}
                                <span className="text-foreground">{frontmatter.title}</span>
                            </nav>

                            <SimulationContainer category={params.category} slug={params.slug} />

                            <Article frontmatter={frontmatter}>
                                <MarkdownRenderer content={content} />
                            </Article>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}