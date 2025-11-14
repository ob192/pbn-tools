<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';

	let heroEl: HTMLElement;

	onMount(() => {
		if (heroEl) {
			animate(
				heroEl,
				{
					opacity: [0, 1],
					y: [30, 0]
				},
				{ duration: 0.6, easing: 'ease-out' }
			);
		}
	});
</script>

<section bind:this={heroEl} class="hero">
	<div class="container">
		<h1>Decode and Inspect JWT & JWE Tokens</h1>
		<p class="hero-description">
			Secure, fast, and privacy-friendly tool for developers. All decoding happens in your browser
			– no data is sent to any server.
		</p>
	</div>
</section>

<style>
	.hero {
		padding: var(--spacing-2xl) 0;
		text-align: center;
		background: linear-gradient(to bottom, var(--color-muted), var(--color-background));
	}

	.hero h1 {
		font-size: 3rem;
		margin-bottom: var(--spacing-lg);
		background: linear-gradient(135deg, var(--color-primary) 0%, #334155 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: 1.25rem;
		max-width: 700px;
		margin: 0 auto;
		color: var(--color-muted-foreground);
	}

	@media (max-width: 768px) {
		.hero {
			padding: var(--spacing-xl) 0;
		}

		.hero h1 {
			font-size: 2rem;
		}

		.hero-description {
			font-size: 1rem;
		}
	}
</style>