// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/private/"],
            },
        ],
        sitemap: "https://cleanpaste.usekit.site/sitemap.xml",
        host: "https://cleanpaste.usekit.site",
    };
}