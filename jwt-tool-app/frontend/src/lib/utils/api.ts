import type { BlogPost } from '$lib/types/blog';

const BLOG_API_URL = 'https://api.example.com/posts'; // Replace with actual API

/**
 * Fetch all blog posts
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const response = await fetch(BLOG_API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Return mock data for development
        return getMockBlogPosts();
    }
}

/**
 * Fetch single blog post by slug
 */
export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const response = await fetch(`${BLOG_API_URL}?slug=${slug}`);

        if (!response.ok) {
            throw new Error('Failed to fetch blog post');
        }

        const data = await response.json();
        return data[0] || null;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        // Return mock data for development
        const mockPosts = getMockBlogPosts();
        return mockPosts.find((post) => post.slug === slug) || null;
    }
}

/**
 * Mock blog data for development
 */
function getMockBlogPosts(): BlogPost[] {
    return [
        {
            id: 1,
            slug: 'understanding-jwt',
            title: 'Understanding JWT and JWE',
            excerpt:
                'Learn the differences between JWT and JWE, and how to use them securely in your applications.',
            content: `
				<p>JWTs (JSON Web Tokens) are a compact, URL-safe means of representing claims to be transferred between two parties. They are commonly used for authentication and authorization in modern web applications.</p>
				
				<h2>What is JWT?</h2>
				<p>A JWT consists of three parts: Header, Payload, and Signature. Each part is Base64URL encoded and separated by dots.</p>
				
				<h2>JWT vs JWE</h2>
				<p>While JWT (JSON Web Token) is used for transmitting claims, JWE (JSON Web Encryption) provides encryption for sensitive data. JWE has five parts instead of three.</p>
				
				<h2>Security Considerations</h2>
				<ul>
					<li>Always validate the signature</li>
					<li>Use HTTPS for transmission</li>
					<li>Set appropriate expiration times</li>
					<li>Never store sensitive data in JWT payload</li>
				</ul>
			`,
            author: 'John Doe',
            publishedAt: '2025-03-15'
        },
        {
            id: 2,
            slug: 'jwt-best-practices',
            title: 'JWT Security Best Practices',
            excerpt: 'Essential security practices when implementing JSON Web Tokens in production.',
            content: `
				<p>Implementing JWT authentication requires careful attention to security. Here are the most important best practices.</p>
				
				<h2>Token Storage</h2>
				<p>Store JWTs in httpOnly cookies to prevent XSS attacks. Avoid localStorage or sessionStorage for sensitive tokens.</p>
				
				<h2>Expiration and Refresh</h2>
				<p>Use short-lived access tokens (15 minutes) with longer-lived refresh tokens. Implement proper token rotation strategies.</p>
			`,
            author: 'Jane Smith',
            publishedAt: '2025-03-20'
        },
        {
            id: 3,
            slug: 'jwe-encryption-guide',
            title: 'Complete Guide to JWE Encryption',
            excerpt: 'Deep dive into JSON Web Encryption and when to use it over standard JWT.',
            content: `
				<p>JWE (JSON Web Encryption) provides encryption capabilities for sensitive data transmission.</p>
				
				<h2>When to Use JWE</h2>
				<p>Use JWE when you need to transmit sensitive information that should not be readable even if intercepted.</p>
				
				<h2>JWE Structure</h2>
				<p>JWE tokens have five parts: Protected Header, Encrypted Key, Initialization Vector, Ciphertext, and Authentication Tag.</p>
			`,
            author: 'Bob Johnson',
            publishedAt: '2025-03-25'
        }
    ];
}