// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = 'https://2fa.media-buying.tools';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/'] // optional
            }
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl
    };
}
