<script lang="ts">
	import type { BlogPost } from '$lib/types/blog';
	import Card from './ui/card.svelte';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'motion';

	export let posts: BlogPost[] = [];

	let cardsContainer: HTMLElement;

	onMount(() => {
		if (cardsContainer) {
			const cards = cardsContainer.querySelectorAll('.blog-card');
			animate(
				cards,
				{ opacity: [0, 1], y: [30, 0] },
				{ delay: stagger(0.1), duration: 0.5 }
			);
		}
	});
</script>

<section class="blog-preview">
	<div class="container">
		<h2>Latest Blog Posts</h2>
		<p class="section-description">
			Learn about JWT, JWE, and security best practices from our expert guides.
		</p>

		<div bind:this={cardsContainer} class="blog-grid">
			{#each posts.slice(0, 3) as post (post.id)}
				<a href="/blog/{post.slug}" class="blog-card">
					<Card padding="lg">
						<h3>{post.title}</h3>
						<p class="excerpt">{post.excerpt}</p>
						<div class="meta">
							<span class="author">{post.author}</span>
							<span class="date">{new Date(post.publishedAt).toLocaleDateString()}</span>
						</div>
						<span class="read-more">Read more →</span>
					</Card>
				</a>
			{/each}
		</div>

		<div class="view-all">
			<a href="/blog" class="view-all-link">View all posts →</a>
		</div>
	</div>
</section>

<style>
	.blog-preview {
		padding: var(--spacing-2xl) 0;
		background-color: var(--color-muted);
	}

	.blog-preview h2 {
		text-align: center;
		margin-bottom: var(--spacing-md);
	}

	.section-description {
		text-align: center;
		max-width: 600px;
		margin: 0 auto var(--spacing-2xl);
	}

	.blog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-xl);
		margin-bottom: var(--spacing-xl);
	}

	.blog-card {
		display: block;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s;
		height: 100%;
	}

	.blog-card:hover {
		transform: translateY(-4px);
	}

	.blog-card h3 {
		color: var(--color-foreground);
		margin-bottom: var(--spacing-md);
		font-size: 1.25rem;
	}

	.excerpt {
		color: var(--color-muted-foreground);
		margin-bottom: var(--spacing-lg);
		line-height: 1.6;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
		color: var(--color-muted-foreground);
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	.read-more {
		color: var(--color-primary);
		font-weight: 600;
		font-size: 0.875rem;
	}

	.view-all {
		text-align: center;
		margin-top: var(--spacing-xl);
	}

	.view-all-link {
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--color-primary);
	}

	@media (max-width: 768px) {
		.blog-grid {
			grid-template-columns: 1fr;
		}
	}
</style>