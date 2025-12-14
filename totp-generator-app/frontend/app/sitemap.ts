// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = 'https://2fa.usekit.site';
    const locales = ['en', 'ru', 'uk'] as const;

    const lastModified = new Date();

    const entries: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified,
            changeFrequency: 'monthly',
            priority: 1,
        },
        ...locales.map((locale): MetadataRoute.Sitemap[number] => ({
            url: `${siteUrl}/${locale}`,
            lastModified,
            changeFrequency: 'monthly',
            priority: locale === 'en' ? 1 : 0.9,
        })),
    ];

    return entries;
}
