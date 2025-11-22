import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: 'https://jwt-decode.online/sitemap.xml',
        host: 'https://jwt-decode.online',
    }
}