import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/utils/blog'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://jwt-decode.online'
    const blogSlugs = getAllSlugs()

    const blogUrls = blogSlugs.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...blogUrls,
    ]
}