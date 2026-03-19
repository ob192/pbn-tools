import { MetadataRoute } from 'next'

const BASE_URL = 'https://reviewcard.io'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL + '/',
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: BASE_URL + '/builder/',
            lastModified: new Date('2025-01-01'),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
    ]
}