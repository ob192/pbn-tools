<script lang="ts">
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let defaultValue: string;

	const activeTab = writable(defaultValue);

	setContext('tabs', {
		activeTab,
		setActiveTab: (value: string) => activeTab.set(value)
	});
</script>

<div class="tabs">
	<slot />
</div>

<style>
	.tabs {
		width: 100%;
	}
</style>