<div class="tabs-list">
	<slot />
</div>

<style>
	.tabs-list {
		display: flex;
		gap: var(--spacing-xs);
		border-bottom: 2px solid var(--color-border);
		margin-bottom: var(--spacing-lg);
	}
</style>