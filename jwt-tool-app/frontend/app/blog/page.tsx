import { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/utils/blog'
import Card from '@/components/ui/Card'
import styles from './blog.module.css'

export const metadata: Metadata = {
    title: 'JWT Security Blog - Best Practices & Tutorials | JWT Decoder',
    description:
        'Learn about JWT security, authentication best practices, OAuth2, OIDC, and common vulnerabilities. Expert guides and tutorials.',
    openGraph: {
        title: 'JWT Security Blog',
        description: 'Expert guides on JWT, OAuth2, and authentication security',
        type: 'website',
    },
}

export default async function BlogPage() {
    const posts = await getAllBlogPosts()

    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <h1>JWT Security Blog</h1>
                    <p className={styles.heroDescription}>
                        Expert guides, best practices, and tutorials on JWT, OAuth2, OIDC,
                        and modern authentication security.
                    </p>
                </div>
            </section>

            <section className={styles.blogSection}>
                <div className="container">
                    {posts.length === 0 ? (
                        <p className={styles.noPosts}>No blog posts available yet.</p>
                    ) : (
                        <div className={styles.blogGrid}>
                            {posts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className={styles.blogCardLink}
                                >
                                    <Card className={styles.blogCard}>
                                        <div className={styles.blogMeta}>
                                            <time dateTime={post.date}>
                                                {new Date(post.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                            {post.readTime && (
                                                <>
                                                    <span className={styles.separator}>•</span>
                                                    <span>{post.readTime}</span>
                                                </>
                                            )}
                                        </div>
                                        <h2>{post.title}</h2>
                                        <p className={styles.excerpt}>{post.excerpt}</p>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className={styles.tags}>
                                                {post.tags.map((tag) => (
                                                    <span key={tag} className={styles.tag}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}