// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://cleanpaste.usekit.site";

    return [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        }
    ];
}