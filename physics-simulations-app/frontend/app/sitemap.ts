// File: app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllSimulations } from "@/lib/getSimulationList";
import { SITE_URL } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {

    const simulations = getAllSimulations();
    const currentDate = new Date().toISOString();

    // 1. Static Routes
    const routes = [
        "",
        "/simulations",
    ].map((route) => ({
        url: `${SITE_URL}${route}`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // 2. Dynamic Simulation Routes
    const simulationRoutes = simulations.map((sim) => ({
        url: `${SITE_URL}/simulations/${sim.category}/${sim.slug}`,
        lastModified: currentDate, // In a real app, read 'date' from frontmatter
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    // 3. Category Routes
    const uniqueCategories = Array.from(new Set(simulations.map((s) => s.category)));
    const categoryRoutes = uniqueCategories.map((category) => ({
        url: `${SITE_URL}/simulations/${category}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...routes, ...categoryRoutes, ...simulationRoutes];
}