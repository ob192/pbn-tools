<script lang="ts">
	export let variant: 'default' | 'outline' | 'ghost' = 'default';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button {type} class="btn btn-{variant} btn-{size}" {disabled} on:click>
	<slot />
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
		font-weight: 600;
		border-radius: var(--radius-md);
		transition: all 0.2s;
		cursor: pointer;
		border: none;
		font-family: var(--font-sans);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Variants */
	.btn-default {
		background-color: var(--color-primary);
		color: var(--color-primary-foreground);
	}

	.btn-default:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-outline {
		background-color: transparent;
		border: 2px solid var(--color-border);
		color: var(--color-foreground);
	}

	.btn-outline:hover:not(:disabled) {
		background-color: var(--color-accent);
	}

	.btn-ghost {
		background-color: transparent;
		color: var(--color-foreground);
	}

	.btn-ghost:hover:not(:disabled) {
		background-color: var(--color-accent);
	}

	/* Sizes */
	.btn-sm {
		padding: var(--spacing-xs) var(--spacing-md);
		font-size: 0.875rem;
	}

	.btn-md {
		padding: var(--spacing-sm) var(--spacing-lg);
		font-size: 1rem;
	}

	.btn-lg {
		padding: var(--spacing-md) var(--spacing-xl);
		font-size: 1.125rem;
	}
</style>