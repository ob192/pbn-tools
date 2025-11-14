<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let value: string;

	const { activeTab, setActiveTab } = getContext<{
		activeTab: Writable<string>;
		setActiveTab: (value: string) => void;
	}>('tabs');

	$: isActive = $activeTab === value;
</script>

<button class="tab-trigger" class:active={isActive} on:click={() => setActiveTab(value)}>
	<slot />
</button>

<style>
	.tab-trigger {
		padding: var(--spacing-sm) var(--spacing-lg);
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		font-weight: 600;
		color: var(--color-muted-foreground);
		transition: all 0.2s;
		font-family: var(--font-sans);
		font-size: 1rem;
	}

	.tab-trigger:hover {
		color: var(--color-foreground);
	}

	.tab-trigger.active {
		color: var(--color-foreground);
		border-bottom-color: var(--color-primary);
	}
</style>