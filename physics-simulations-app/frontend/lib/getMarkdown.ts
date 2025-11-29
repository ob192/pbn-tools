// File: lib/getMarkdown.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SimulationData, SimulationFrontmatter } from "@/types/simulation";

const contentDirectory = path.join(process.cwd(), "content");

export async function getSimulationData(
    category: string,
    slug: string
): Promise<SimulationData | null> {
    const filePath = path.join(contentDirectory, category, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontmatter = data as SimulationFrontmatter;

    return {
        frontmatter,
        content,
        category,
        slug,
    };
}

export function getAllSimulationPaths(): { category: string; slug: string }[] {
    const paths: { category: string; slug: string }[] = [];

    const categories = fs.readdirSync(contentDirectory);

    categories.forEach((category) => {
        const categoryPath = path.join(contentDirectory, category);

        if (!fs.statSync(categoryPath).isDirectory()) return;

        const files = fs.readdirSync(categoryPath);

        files.forEach((file) => {
            if (!file.endsWith(".mdx")) return;

            paths.push({
                category,
                slug: file.replace(".mdx", ""),
            });
        });
    });

    return paths;
}