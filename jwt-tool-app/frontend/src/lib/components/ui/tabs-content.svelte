<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { animate } from 'motion';
	import { onMount } from 'svelte';

	export let value: string;

	const { activeTab } = getContext<{ activeTab: Writable<string> }>('tabs');

	$: isActive = $activeTab === value;

	let contentEl: HTMLDivElement;

	onMount(() => {
		if (isActive && contentEl) {
			animate(contentEl, { opacity: [0, 1], y: [10, 0] }, { duration: 0.3 });
		}
	});

	$: if (isActive && contentEl) {
		animate(contentEl, { opacity: [0, 1], y: [10, 0] }, { duration: 0.3 });
	}
</script>

{#if isActive}
	<div bind:this={contentEl} class="tab-content">
		<slot />
	</div>
{/if}

<style>
	.tab-content {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>