import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { BlogPost, BlogMetadata } from '@/lib/types/blog'

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog')

export async function getAllBlogPosts(): Promise<BlogPost[]> {
    // Ensure directory exists
    if (!fs.existsSync(BLOG_DIRECTORY)) {
        return []
    }

    const fileNames = fs.readdirSync(BLOG_DIRECTORY)
    const allPosts = await Promise.all(
        fileNames
            .filter((fileName) => fileName.endsWith('.md'))
            .map(async (fileName) => {
                const slug = fileName.replace(/\.md$/, '')
                return await getBlogPost(slug)
            })
    )

    // Sort posts by date (newest first)
    return allPosts
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const fullPath = path.join(BLOG_DIRECTORY, `${slug}.md`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Parse markdown metadata and content
        const { data, content } = matter(fileContents)
        const metadata = data as BlogMetadata

        // Convert markdown to HTML
        const processedContent = await remark().use(html).process(content)
        const contentHtml = processedContent.toString()

        // Generate excerpt (first 200 characters)
        const excerpt =
            metadata.description ||
            content.replace(/[#*`]/g, '').slice(0, 200) + '...'

        return {
            slug,
            title: metadata.title,
            description: metadata.description,
            date: metadata.date,
            author: metadata.author || 'JWT Decoder Team',
            tags: metadata.tags || [],
            readTime: metadata.readTime || calculateReadTime(content),
            content: contentHtml,
            excerpt,
        }
    } catch (error) {
        console.error(`Error loading blog post ${slug}:`, error)
        return null
    }
}

export function getAllSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIRECTORY)) {
        return []
    }

    const fileNames = fs.readdirSync(BLOG_DIRECTORY)
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''))
}

function calculateReadTime(content: string): string {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}