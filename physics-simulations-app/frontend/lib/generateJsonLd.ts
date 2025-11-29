// File: lib/generateJsonLd.ts
import { SimulationFrontmatter } from "@/types/simulation";
import { SITE_URL, SITE_NAME } from "./categories";

export function generateArticleJsonLd(
    frontmatter: SimulationFrontmatter,
    category: string,
    slug: string
) {
    const url = `${SITE_URL}/simulations/${category}/${slug}`;
    const imageUrl = frontmatter.image || `${SITE_URL}/images/og/${slug}.png`;

    return {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: frontmatter.title,
        description: frontmatter.description,
        image: imageUrl,
        datePublished: frontmatter.date,
        dateModified: frontmatter.date,
        author: {
            "@type": "Organization",
            name: frontmatter.author || SITE_NAME,
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        articleSection: category,
        keywords: frontmatter.tags.join(", "),
        // Educational specific tags
        educationalLevel: "High School, Undergraduate",
        learningResourceType: "Simulation",
    };
}

export function generateBreadcrumbJsonLd(
    category: string,
    categoryName: string,
    simulationTitle: string,
    slug: string
) {

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Simulations",
                item: `${SITE_URL}/simulations`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: categoryName,
                item: `${SITE_URL}/simulations/${category}`,
            },
            {
                "@type": "ListItem",
                position: 4,
                name: simulationTitle,
                item: `${SITE_URL}/simulations/${category}/${slug}`,
            },
        ],
    };
}

export function generateWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: "Interactive physics simulations for learning and exploration",
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
}