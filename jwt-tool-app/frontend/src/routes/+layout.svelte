<script lang="ts">
	import '../app.css';
</script>

<div class="app">
	<header class="site-header">
		<nav class="container">
			<a href="/" class="logo">JWT Decoder</a>
			<div class="nav-links">
				<a href="/">Home</a>
				<a href="/blog">Blog</a>
			</div>
		</nav>
	</header>

	<main>
		<slot />
	</main>

	<footer class="site-footer">
		<div class="container">
			<p>&copy; 2025 JWT Decoder. Built with SvelteKit. Privacy-first, client-side decoding.</p>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.site-header {
		border-bottom: 1px solid var(--color-border);
		background-color: var(--color-background);
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(8px);
	}

	.site-header nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-lg) var(--spacing-lg);
	}

	.logo {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-foreground);
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: var(--spacing-xl);
	}

	.nav-links a {
		color: var(--color-muted-foreground);
		font-weight: 600;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: var(--color-foreground);
	}

	main {
		flex: 1;
	}

	.site-footer {
		border-top: 1px solid var(--color-border);
		padding: var(--spacing-2xl) 0;
		background-color: var(--color-muted);
		margin-top: var(--spacing-2xl);
	}

	.site-footer p {
		text-align: center;
		color: var(--color-muted-foreground);
		margin: 0;
	}
</style>