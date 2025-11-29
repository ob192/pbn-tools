import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
    SimulationListItem,
    GroupedSimulations,
    SimulationFrontmatter,
} from "@/types/simulation";
import { CATEGORIES } from "./categories";

const contentDirectory = path.join(process.cwd(), "content");

export function getAllSimulations(): SimulationListItem[] {
    const simulations: SimulationListItem[] = [];

    CATEGORIES.forEach((category) => {
        const categoryPath = path.join(contentDirectory, category.slug);

        if (!fs.existsSync(categoryPath)) {
            return;
        }

        const files = fs.readdirSync(categoryPath);

        files.forEach((file) => {
            if (!file.endsWith(".mdx")) return;

            const filePath = path.join(categoryPath, file);
            const fileContents = fs.readFileSync(filePath, "utf8");
            const { data } = matter(fileContents);
            const frontmatter = data as SimulationFrontmatter;

            simulations.push({
                title: frontmatter.title,
                slug: frontmatter.slug,
                category: category.slug,
                description: frontmatter.description,

                // extra metadata
                date: frontmatter.date,
                author: frontmatter.author,
                tags: frontmatter.tags,
                readTime: frontmatter.readTime,
                image: frontmatter.image,
            });
        });
    });

    return simulations;
}

export function getSimulationsByCategory(): GroupedSimulations {
    const simulations = getAllSimulations();
    const grouped: GroupedSimulations = {};

    simulations.forEach((sim) => {
        if (!grouped[sim.category]) {
            grouped[sim.category] = [];
        }
        grouped[sim.category].push(sim);
    });

    return grouped;
}

export function getCategorySimulations(category: string): SimulationListItem[] {
    const categoryPath = path.join(contentDirectory, category);
    const simulations: SimulationListItem[] = [];

    if (!fs.existsSync(categoryPath)) {
        return simulations;
    }

    const files = fs.readdirSync(categoryPath);

    files.forEach((file) => {
        if (!file.endsWith(".mdx")) return;

        const filePath = path.join(categoryPath, file);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const frontmatter = data as SimulationFrontmatter;

        simulations.push({
            title: frontmatter.title,
            slug: frontmatter.slug,
            category,
            description: frontmatter.description,

            // extra metadata
            date: frontmatter.date,
            author: frontmatter.author,
            tags: frontmatter.tags,
            readTime: frontmatter.readTime,
            image: frontmatter.image,
        });
    });

    return simulations;
}

export function generateStaticParams() {
    const simulations = getAllSimulations();

    return simulations.map((sim) => ({
        category: sim.category,
        slug: sim.slug,
    }));
}

export function generateCategoryParams() {
    return CATEGORIES.map((cat) => ({
        category: cat.slug,
    }));
}
