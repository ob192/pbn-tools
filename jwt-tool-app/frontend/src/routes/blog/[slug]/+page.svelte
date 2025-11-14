<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { animate } from 'motion';

	export let data: PageData;

	const { post } = data;

	let articleEl: HTMLElement;

	onMount(() => {
		if (articleEl) {
			animate(articleEl, { opacity: [0, 1], y: [30, 0] }, { duration: 0.5 });
		}
	});

	// Generate JSON-LD structured data
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		author: {
			'@type': 'Person',
			name: post.author
		},
		datePublished: post.publishedAt,
		articleBody: post.content
	};
</script>

<svelte:head>
	<title>{post.title} - JWT/JWE Decoder Blog</title>
	<meta name="description" content={post.excerpt} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="article:author" content={post.author} />
	<meta property="article:published_time" content={post.publishedAt} />
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<article bind:this={articleEl} class="blog-post">
	<div class="container-sm">
		<header class="post-header">
			<h1>{post.title}</h1>
			<div class="post-meta">
				<span class="author">By {post.author}</span>
				<span class="separator">•</span>
				<time datetime={post.publishedAt}>
					{new Date(post.publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</time>
			</div>
		</header>

		<div class="post-content">
			{@html post.content}
		</div>

		<footer class="post-footer">
			<a href="/blog" class="back-link">← Back to Blog</a>
		</footer>
	</div>
</article>

<style>
	.blog-post {
		padding: var(--spacing-2xl) 0;
		min-height: 60vh;
	}

	.post-header {
		margin-bottom: var(--spacing-2xl);
		padding-bottom: var(--spacing-xl);
		border-bottom: 1px solid var(--color-border);
	}

	.post-header h1 {
		font-size: 2.5rem;
		margin-bottom: var(--spacing-lg);
		line-height: 1.2;
	}

	.post-meta {
		display: flex;
		gap: var(--spacing-sm);
		align-items: center;
		color: var(--color-muted-foreground);
		font-size: 0.875rem;
	}

	.separator {
		opacity: 0.5;
	}

	.post-content {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--color-foreground);
	}

	.post-content :global(h2) {
		margin-top: var(--spacing-2xl);
		margin-bottom: var(--spacing-lg);
		font-size: 1.75rem;
	}

	.post-content :global(h3) {
		margin-top: var(--spacing-xl);
		margin-bottom: var(--spacing-md);
		font-size: 1.5rem;
	}

	.post-content :global(p) {
		margin-bottom: var(--spacing-lg);
		color: var(--color-foreground);
	}

	.post-content :global(ul),
	.post-content :global(ol) {
		margin-bottom: var(--spacing-lg);
		padding-left: var(--spacing-xl);
	}

	.post-content :global(li) {
		margin-bottom: var(--spacing-sm);
		color: var(--color-foreground);
	}

	.post-content :global(code) {
		background-color: var(--color-muted);
		padding: 0.2em 0.4em;
		border-radius: var(--radius-sm);
		font-size: 0.9em;
	}

	.post-content :global(pre) {
		margin: var(--spacing-lg) 0;
	}

	.post-footer {
		margin-top: var(--spacing-2xl);
		padding-top: var(--spacing-xl);
		border-top: 1px solid var(--color-border);
	}

	.back-link {
		color: var(--color-primary);
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	@media (max-width: 768px) {
		.post-header h1 {
			font-size: 2rem;
		}

		.post-content {
			font-size: 1rem;
		}
	}
</style>