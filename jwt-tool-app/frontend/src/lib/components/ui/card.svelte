<script lang="ts">
	export let padding: 'sm' | 'md' | 'lg' = 'md';
</script>

<div class="card card-padding-{padding}">
	<slot />
</div>

<style>
	.card {
		background-color: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-md);
	}

	.card-padding-sm {
		padding: var(--spacing-md);
	}

	.card-padding-md {
		padding: var(--spacing-lg);
	}

	.card-padding-lg {
		padding: var(--spacing-xl);
	}
</style>