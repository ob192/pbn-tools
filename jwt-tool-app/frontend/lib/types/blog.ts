export interface DecodedJWT {
    header: Record<string, any>
    payload: Record<string, any>
    signature: string
}

export interface BlogPost {
    slug: string
    title: string
    description: string
    date: string
    author?: string
    tags?: string[]
    readTime?: string
    content: string
    excerpt: string
}

export interface BlogMetadata {
    title: string
    description: string
    date: string
    author?: string
    tags?: string[]
    readTime?: string
}