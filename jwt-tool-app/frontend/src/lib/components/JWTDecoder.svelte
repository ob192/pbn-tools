<script lang="ts">
	import { decodeJWT, decodeJWE, isValidJWTStructure } from '$lib/utils/jwt';
	import type { DecodedJWT } from '$lib/types/blog';
	import Card from './ui/card.svelte';
	import Button from './ui/button.svelte';
	import Tabs from './ui/tabs.svelte';
	import TabsList from './ui/tabs-list.svelte';
	import TabsTrigger from './ui/tabs-trigger.svelte';
	import TabsContent from './ui/tabs-content.svelte';
	import { onMount } from 'svelte';
	import { animate } from 'motion';

	let token = '';
	let decodedData: DecodedJWT | null = null;
	let error = '';
	let isJWE = false;
	let containerEl: HTMLElement;

	function handleDecode() {
		error = '';
		decodedData = null;
		isJWE = false;

		if (!token.trim()) {
			error = 'Please enter a token';
			return;
		}

		try {
			// Check if it's JWE (5 parts) or JWT (3 parts)
			const parts = token.split('.');

			if (parts.length === 5) {
				isJWE = true;
				decodeJWE(token);
				error = 'JWE decoding preview only. Full encryption details require cryptographic keys.';
			} else if (parts.length === 3) {
				decodedData = decodeJWT(token);
			} else {
				throw new Error('Invalid token format');
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to decode token';
		}
	}

	function handleClear() {
		token = '';
		decodedData = null;
		error = '';
		isJWE = false;
	}

	onMount(() => {
		if (containerEl) {
			animate(containerEl, { opacity: [0, 1], y: [20, 0] }, { duration: 0.5, delay: 0.2 });
		}
	});
</script>

<section bind:this={containerEl} class="decoder-section">
	<div class="container-sm">
		<Card padding="lg">
			<h2>JWT/JWE Decoder</h2>

			<div class="input-group">
				<label for="token-input">Paste your JWT or JWE token</label>
				<textarea
					id="token-input"
					bind:value={token}
					placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
					rows="6"
				/>
			</div>

			<div class="button-group">
				<Button on:click={handleDecode}>Decode Token</Button>
				<Button variant="outline" on:click={handleClear}>Clear</Button>
			</div>

			{#if error}
				<div class="error-message" class:warning={isJWE}>
					{error}
				</div>
			{/if}

			{#if decodedData && !isJWE}
				<div class="results">
					<Tabs defaultValue="header">
						<TabsList>
							<TabsTrigger value="header">Header</TabsTrigger>
							<TabsTrigger value="payload">Payload</TabsTrigger>
						</TabsList>

						<TabsContent value="header">
							<div class="json-display">
								<pre><code>{JSON.stringify(decodedData.header, null, 2)}</code></pre>
							</div>
						</TabsContent>

						<TabsContent value="payload">
							<div class="json-display">
								<pre><code>{JSON.stringify(decodedData.payload, null, 2)}</code></pre>
							</div>
						</TabsContent>
					</Tabs>

					<div class="signature-section">
						<h3>Signature</h3>
						<code class="signature-code">{decodedData.signature}</code>
					</div>
				</div>
			{/if}
		</Card>
	</div>
</section>

<style>
	.decoder-section {
		padding: var(--spacing-2xl) 0;
	}

	.decoder-section h2 {
		margin-bottom: var(--spacing-lg);
		color: var(--color-foreground);
	}

	.input-group {
		margin-bottom: var(--spacing-lg);
	}

	.input-group label {
		display: block;
		margin-bottom: var(--spacing-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	textarea {
		width: 100%;
		padding: var(--spacing-md);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: 0.875rem;
		resize: vertical;
		transition: border-color 0.2s;
		background-color: var(--color-background);
		color: var(--color-foreground);
	}

	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.button-group {
		display: flex;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-lg);
	}

	.error-message {
		padding: var(--spacing-md);
		background-color: #fee;
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		color: var(--color-error);
		margin-bottom: var(--spacing-lg);
	}

	.error-message.warning {
		background-color: #fef3c7;
		border-color: #f59e0b;
		color: #92400e;
	}

	.results {
		margin-top: var(--spacing-xl);
	}

	.json-display {
		max-height: 400px;
		overflow-y: auto;
		background-color: var(--color-muted);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
	}

	.json-display pre {
		margin: 0;
		background: transparent;
		border: none;
		padding: 0;
	}

	.signature-section {
		margin-top: var(--spacing-xl);
		padding-top: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
	}

	.signature-section h3 {
		font-size: 1rem;
		margin-bottom: var(--spacing-sm);
		color: var(--color-foreground);
	}

	.signature-code {
		display: block;
		padding: var(--spacing-md);
		background-color: var(--color-muted);
		border-radius: var(--radius-md);
		word-break: break-all;
		color: var(--color-muted-foreground);
	}

	@media (max-width: 768px) {
		.button-group {
			flex-direction: column;
		}
	}
</style>