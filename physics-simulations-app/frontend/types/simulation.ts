export interface SimulationFrontmatter {
    title: string;
    description: string;
    date: string;         // ISO string "2025-02-10"
    author: string;
    tags: string[];
    readTime: string;     // e.g. "6 min read"
    category: string;     // should match folder/category slug
    slug: string;         // URL slug, e.g. "pendulum"
    image?: string;       // optional hero/thumbnail image
}

export interface SimulationData {
    frontmatter: SimulationFrontmatter;
    content: string;      // MDX content as string
    category: string;     // convenience (duplicate of frontmatter.category)
    slug: string;         // convenience (duplicate of frontmatter.slug)
}

export interface CategoryInfo {
    name: string;
    slug: string;
    description: string;
    icon: string;
}

/**
 * Lightweight representation for lists / nav / cards.
 * All extra fields are optional so old MDX won’t crash anything.
 */
export interface SimulationListItem {
    title: string;
    slug: string;
    category: string;
    description: string;

    date?: string;
    author?: string;
    tags?: string[];
    readTime?: string;
    image?: string;
}

export interface GroupedSimulations {
    [category: string]: SimulationListItem[];
}
