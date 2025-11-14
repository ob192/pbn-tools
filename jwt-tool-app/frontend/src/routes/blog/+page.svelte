<script lang="ts">
	import type { PageData } from './$types';
	import Card from '$lib/components/ui/card.svelte';
	import { onMount } from 'svelte';
	import { animate, stagger } from 'motion';

	export let data: PageData;

	let postsContainer: HTMLElement;

	onMount(() => {
		if (postsContainer) {
			const cards = postsContainer.querySelectorAll('.post-card');
			animate(
				cards,
				{ opacity: [0, 1], y: [30, 0] },
				{ delay: stagger(0.1), duration: 0.5 }
			);
		}
	});
</script>

<svelte:head>
	<title>Blog - JWT/JWE Decoder</title>
	<meta
		name="description"
		content="Learn about JWT, JWE, security best practices, and token authentication."
	/>
	<meta property="og:title" content="Blog - JWT/JWE Decoder" />
	<meta
		property="og:description"
		content="Learn about JWT, JWE, security best practices, and token authentication."
	/>
</svelte:head>

<div class="blog-page">
	<div class="container">
		<header class="page-header">
			<h1>Blog</h1>
			<p>Learn about JWT, JWE, and security best practices</p>
		</header>

		<div bind:this={postsContainer} class="posts-grid">
			{#each data.posts as post (post.id)}
				<a href="/blog/{post.slug}" class="post-card">
					<Card padding="lg">
						<h2>{post.title}</h2>
						<p class="excerpt">{post.excerpt}</p>
						<div class="meta">
							<span class="author">By {post.author}</span>
							<span class="date">{new Date(post.publishedAt).toLocaleDateString()}</span>
						</div>
					</Card>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.blog-page {
		padding: var(--spacing-2xl) 0;
		min-height: 60vh;
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--spacing-2xl);
	}

	.page-header h1 {
		font-size: 3rem;
		margin-bottom: var(--spacing-md);
	}

	.page-header p {
		font-size: 1.25rem;
		color: var(--color-muted-foreground);
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: var(--spacing-xl);
	}

	.post-card {
		display: block;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s;
	}

	.post-card:hover {
		transform: translateY(-4px);
	}

	.post-card h2 {
		color: var(--color-foreground);
		font-size: 1.5rem;
		margin-bottom: var(--spacing-md);
	}

	.excerpt {
		color: var(--color-muted-foreground);
		line-height: 1.6;
		margin-bottom: var(--spacing-lg);
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
		color: var(--color-muted-foreground);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border);
	}

	@media (max-width: 768px) {
		.page-header h1 {
			font-size: 2rem;
		}

		.posts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>