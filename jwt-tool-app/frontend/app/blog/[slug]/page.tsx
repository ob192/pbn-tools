import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPost, getAllSlugs } from '@/lib/utils/blog'
import Card from '@/components/ui/Card'
import styles from './post.module.css'

export async function generateStaticParams() {
    const slugs = getAllSlugs()
    return slugs.map((slug) => ({
        slug,
    }))
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {

    const { slug } = await params;

    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    return {
        title: `${post.title} | JWT Decoder Blog`,
        description: post.description || post.excerpt,
        keywords: post.tags,
        authors: post.author ? [{ name: post.author }] : undefined,
        openGraph: {
            title: post.title,
            description: post.description || post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: post.author ? [post.author] : undefined,
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description || post.excerpt,
        },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound()
    }

    return (
        <article className={styles.blogPost}>
            <div className={styles.containerNarrow}>
                <Link href="/blog" className={styles.backLink}>
                    ← Back to Blog
                </Link>

                <header className={styles.postHeader}>
                    <h1>{post.title}</h1>
                    <div className={styles.postMeta}>
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        {post.author && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span>By {post.author}</span>
                            </>
                        )}
                        {post.readTime && (
                            <>
                                <span className={styles.separator}>•</span>
                                <span>{post.readTime}</span>
                            </>
                        )}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className={styles.tags}>
                            {post.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <Card padding="lg" className={styles.postContent}>
                    <div
                        className={styles.prose}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </Card>
            </div>
        </article>
    )
}
