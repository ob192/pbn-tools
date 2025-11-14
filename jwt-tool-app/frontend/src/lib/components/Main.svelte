<script lang="ts">
	import { decodeJWT, decodeJWE } from '$lib/utils/jwt';
	import type { DecodedJWT } from '$lib/types/blog';
	import Card from '$lib/components/ui/card.svelte';
	import Tabs from '$lib/components/ui/tabs.svelte';
	import TabsList from '$lib/components/ui/tabs-list.svelte';
	import TabsTrigger from '$lib/components/ui/tabs-trigger.svelte';
	import TabsContent from '$lib/components/ui/tabs-content.svelte';

	// Decode state
	let token = '';
	let decodedData: DecodedJWT | null = null;
	let error = '';
	let isJWE = false;

	// Encode state
	let encodeHeader = '{"alg":"HS256","typ":"JWT"}';
	let encodePayload =
			'{"sub":"1234567890","name":"John Doe","admin":true,"iat":1516239022}';
	let encodeSecret = '';
	let encodePrivateKey = '';
	let encodePublicKey = '';
	let encodeAlg = 'HS256';
	let encodedToken = '';
	let encodeError = '';

	// Auto-decode when token changes
	$: if (token.trim()) {
		handleDecode();
	} else {
		decodedData = null;
		error = '';
		isJWE = false;
	}

	// Sync dropdown algorithm to header JSON (reactive - one direction)
	$: {
		try {
			const parsed = JSON.parse(encodeHeader || '{}');
			if (parsed.alg !== encodeAlg) {
				parsed.alg = encodeAlg;
				encodeHeader = JSON.stringify(parsed);
			}
		} catch {
			// Invalid JSON - user might be editing
		}
	}

	// Sync header algorithm to dropdown (event handler - other direction)
	function syncHeaderToDropdown() {
		try {
			const parsed = JSON.parse(encodeHeader);
			if (parsed.alg && typeof parsed.alg === 'string' && parsed.alg !== encodeAlg) {
				encodeAlg = parsed.alg;
			}
		} catch {
			// Invalid JSON - ignore while user is typing
		}
	}

	// Determine if current algorithm requires keys vs secret
	$: isHMACAlg = encodeAlg.startsWith('HS');
	$: isRSAAlg = encodeAlg.startsWith('RS');
	$: isECDSAAlg = encodeAlg.startsWith('ES');
	$: isNoneAlg = encodeAlg === 'none';

	// Auto-encode when inputs change
	$: {
		const hasHMACSecret = isHMACAlg && encodeSecret.trim();
		const hasAsymmetricKey = (isRSAAlg || isECDSAAlg) && encodePrivateKey.trim();
		const isNone = isNoneAlg;

		if (encodeHeader && encodePayload && (hasHMACSecret || hasAsymmetricKey || isNone)) {
			handleEncode();
		} else {
			encodedToken = '';
			encodeError = '';
		}
	}

	function handleDecode() {
		error = '';
		decodedData = null;
		isJWE = false;

		if (!token.trim()) {
			return;
		}

		try {
			const parts = token.split('.');

			if (parts.length === 5) {
				isJWE = true;
				// basic structural check / preview
				decodeJWE(token);
				error =
						'JWE decoding preview only. Full decryption requires the correct cryptographic keys.';
			} else if (parts.length === 3) {
				decodedData = decodeJWT(token);
			} else {
				throw new Error(
						'Invalid token format. Expected JWT (3 parts) or JWE (5 parts).'
				);
			}
		} catch (e) {
			error =
					e instanceof Error
							? e.message
							: 'Failed to decode token. Please verify the value and try again.';
		}
	}

	function base64UrlEncode(input: string): string {
		return btoa(input)
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=+$/g, '');
	}

	function base64UrlEncodeBytes(bytes: Uint8Array): string {
		let binary = '';
		for (let i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return base64UrlEncode(binary);
	}

	// Get hash algorithm name based on JWT algorithm
	function getHashAlgorithm(alg: string): string {
		if (alg.endsWith('256')) return 'SHA-256';
		if (alg.endsWith('384')) return 'SHA-384';
		if (alg.endsWith('512')) return 'SHA-512';
		return 'SHA-256';
	}

	// Get ECDSA curve name based on algorithm
	function getECDSACurve(alg: string): string {
		switch (alg) {
			case 'ES256':
				return 'P-256';
			case 'ES384':
				return 'P-384';
			case 'ES512':
				return 'P-521'; // Note: P-521, not P-512
			default:
				return 'P-256';
		}
	}

	// Convert PEM to ArrayBuffer
	function pemToArrayBuffer(pem: string, type: 'private' | 'public'): ArrayBuffer {
		// Remove PEM header/footer and whitespace
		const pemHeader = type === 'private' ? '-----BEGIN PRIVATE KEY-----' : '-----BEGIN PUBLIC KEY-----';
		const pemFooter = type === 'private' ? '-----END PRIVATE KEY-----' : '-----END PUBLIC KEY-----';

		const pemContents = pem
				.replace(pemHeader, '')
				.replace(pemFooter, '')
				.replace(/\s/g, '');

		// Decode base64
		const binaryString = atob(pemContents);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	// HMAC encoder supporting HS256, HS384, HS512
	async function encodeHMAC(data: string): Promise<string> {
		const enc = new TextEncoder();
		const hashAlg = getHashAlgorithm(encodeAlg);

		const key = await crypto.subtle.importKey(
				'raw',
				enc.encode(encodeSecret),
				{ name: 'HMAC', hash: hashAlg },
				false,
				['sign']
		);

		const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
		return base64UrlEncodeBytes(new Uint8Array(signature));
	}

	// RSA encoder supporting RS256, RS384, RS512
	async function encodeRSA(data: string): Promise<string> {
		const enc = new TextEncoder();
		const hashAlg = getHashAlgorithm(encodeAlg);

		// Import private key
		const keyData = pemToArrayBuffer(encodePrivateKey, 'private');
		const key = await crypto.subtle.importKey(
				'pkcs8',
				keyData,
				{
					name: 'RSASSA-PKCS1-v1_5',
					hash: hashAlg
				},
				false,
				['sign']
		);

		const signature = await crypto.subtle.sign(
				'RSASSA-PKCS1-v1_5',
				key,
				enc.encode(data)
		);
		return base64UrlEncodeBytes(new Uint8Array(signature));
	}

	// ECDSA encoder supporting ES256, ES384, ES512
	async function encodeECDSA(data: string): Promise<string> {
		const enc = new TextEncoder();
		const curve = getECDSACurve(encodeAlg);
		const hashAlg = getHashAlgorithm(encodeAlg);

		// Import private key
		const keyData = pemToArrayBuffer(encodePrivateKey, 'private');
		const key = await crypto.subtle.importKey(
				'pkcs8',
				keyData,
				{
					name: 'ECDSA',
					namedCurve: curve
				},
				false,
				['sign']
		);

		const signature = await crypto.subtle.sign(
				{
					name: 'ECDSA',
					hash: hashAlg
				},
				key,
				enc.encode(data)
		);
		return base64UrlEncodeBytes(new Uint8Array(signature));
	}

	// Main encoder
	async function handleEncode() {
		encodeError = '';
		encodedToken = '';

		try {
			const header = JSON.parse(encodeHeader || '{}');
			const payload = JSON.parse(encodePayload || '{}');

			const headerSegment = base64UrlEncode(JSON.stringify(header));
			const payloadSegment = base64UrlEncode(JSON.stringify(payload));
			const data = `${headerSegment}.${payloadSegment}`;

			let signatureSegment = '';

			// Handle different algorithm types
			if (encodeAlg === 'none') {
				// No signature for "none" algorithm
				signatureSegment = '';
			} else if (isHMACAlg) {
				if (!encodeSecret.trim()) {
					encodeError = 'Secret is required for HMAC algorithms.';
					return;
				}
				signatureSegment = await encodeHMAC(data);
			} else if (isRSAAlg) {
				if (!encodePrivateKey.trim()) {
					encodeError = 'Private key is required for RSA algorithms.';
					return;
				}
				signatureSegment = await encodeRSA(data);
			} else if (isECDSAAlg) {
				if (!encodePrivateKey.trim()) {
					encodeError = 'Private key is required for ECDSA algorithms.';
					return;
				}
				signatureSegment = await encodeECDSA(data);
			} else {
				encodeError = 'Unsupported algorithm.';
				return;
			}

			encodedToken = signatureSegment ? `${data}.${signatureSegment}` : `${data}.`;
		} catch (e) {
			encodeError =
					e instanceof Error
							? e.message
							: 'Failed to encode JWT. Check inputs and try again.';
		}
	}

	const faqs = [
		{
			q: 'Is my token sent to any server?',
			a: 'No. All decoding and encoding is performed locally in your browser. Tokens and secrets never leave your device.'
		},
		{
			q: 'Which token types are supported?',
			a: 'Standard JWTs (3-part tokens) are fully decoded. JWE (5-part tokens) are detected and structurally parsed, but full decryption requires your own cryptographic keys.'
		},
		{
			q: 'Does decoding prove the token is valid?',
			a: 'Decoding only reveals the header and payload. You must still verify the signature, issuer, audience, expiration, and other claims in your own backend or identity provider.'
		},
		{
			q: 'Can I safely use this for production debugging?',
			a: 'Yes, when self-hosted or trusted, because all logic is client-side. Still, you should avoid pasting extremely sensitive production tokens into any tool you do not control.'
		},
		{
			q: 'Do you log or store any token data?',
			a: 'The recommended deployment is fully static with no token-level analytics. Host it yourself to ensure full control and compliance with internal security policies.'
		},
		{
			q: 'Which signing algorithms are supported?',
			a: 'The encoder supports HMAC (HS256/384/512), RSA (RS256/384/512), ECDSA (ES256/384/512), and "none" for testing. Asymmetric algorithms require PEM-formatted PKCS#8 private keys.'
		},
		{
			q: 'How do I generate RSA or ECDSA keys?',
			a: 'Use OpenSSL commands like "openssl genrsa -out private.pem 2048" for RSA or "openssl ecparam -genkey -name prime256v1 -noout -out private.pem" for ECDSA. Convert to PKCS#8 format with "openssl pkcs8 -topk8 -nocrypt -in private.pem".'
		}
	];

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.a
			}
		}))
	};

	const pageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'JWT/JWE Decoder & Encoder - Secure Token Inspector',
		applicationCategory: 'DeveloperApplication',
		description:
				'A secure, privacy-first JWT & JWE decoder and encoder supporting HMAC, RSA, and ECDSA algorithms. Runs entirely in your browser. Inspect headers, payloads and signatures, validate token structure, and experiment with JSON Web Tokens without sending credentials or secrets to any external server. Ideal for debugging OAuth2, OIDC, API Gateway, microservices, and modern identity integrations.',
		url: 'https://example.com/jwt-decoder',
		operatingSystem: 'All',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		}
	};
</script>

<svelte:head>
	<title>JWT &amp; JWE Decoder / Encoder - Secure Token Inspector</title>

	<meta
			name="description"
			content="Secure, privacy-first JWT &amp; JWE decoder and encoder for developers. Decode, inspect, and generate JSON Web Tokens with HMAC, RSA, and ECDSA algorithms directly in your browser with no server-side processing. Visualize headers and payloads in JSON, validate token structure, and debug OAuth2, OIDC, API gateway, and microservice authentication safely and efficiently."
	/>
	<meta
			name="keywords"
			content="JWT decoder,JWE decoder,JWT encoder,JSON Web Token,HS256,HS384,HS512,RS256,RS384,RS512,ES256,ES384,ES512,token inspector,OIDC,OAuth2,security tool,JWS,JWT viewer,RSA,ECDSA"
	/>

	<meta
			property="og:title"
			content="JWT &amp; JWE Decoder / Encoder - Secure Token Inspector"
	/>
	<meta
			property="og:description"
			content="Decode, inspect, and generate JWTs securely in your browser. Supports HMAC, RSA, and ECDSA. 100% client-side, privacy-friendly, and optimized for debugging OAuth2, OIDC, and API tokens."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://example.com/jwt-decoder" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
			name="twitter:title"
			content="JWT &amp; JWE Decoder / Encoder - Secure Token Inspector"
	/>
	<meta
			name="twitter:description"
			content="Developer-focused JWT/JWE decode &amp; encode tool. Secure, instant, and entirely browser-based."
	/>
	<link rel="canonical" href="https://example.com/jwt-decoder" />

	{@html `<script type="application/ld+json">${JSON.stringify(pageSchema)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<section class="hero">
	<div class="container">
		<h1>JWT &amp; JWE Decoder / Encoder</h1>
		<p class="hero-description">
			Decode, inspect, and generate JSON Web Tokens in a secure, privacy-first environment.
			All operations run locally in your browser, making this the ideal companion for debugging
			OAuth2, OIDC, API gateways, microservices, and modern identity platforms without exposing
			sensitive tokens to third-party services.
		</p>
	</div>
</section>

<section class="tool-section">
	<div class="container">
		<Card padding="lg" class="tool-card">
			<h2 class="section-title">Decode or Encode JWT Tokens</h2>
			<p class="section-subtitle">
				Paste an existing token to instantly inspect its header and payload, or enter data to
				generate a signed JWT with HMAC, RSA, or ECDSA algorithms in real-time for safe local testing and integration.
			</p>

			<Tabs defaultValue="decode" class="tabs-root">
				<TabsList class="tabs-list">
					<TabsTrigger value="decode">Decode JWT / JWE</TabsTrigger>
					<TabsTrigger value="encode">Encode JWT</TabsTrigger>
				</TabsList>

				<!-- DECODE TAB -->
				<TabsContent value="decode" class="tabs-content">
					<div class="input-group">
						<label for="token-input">Paste your JWT or JWE token (decodes automatically)</label>
						<textarea
								id="token-input"
								bind:value={token}
								placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
								rows="6"
								spellcheck="false"
						/>
					</div>

					{#if error}
						<div class="error-message" class:warning={isJWE}>
							{error}
						</div>
					{/if}

					{#if decodedData && !isJWE}
						<div class="results">
							<div class="decode-section">
								<h3>Header</h3>
								<div class="json-display">
									<pre><code>{JSON.stringify(decodedData.header, null, 2)}</code></pre>
								</div>
							</div>

							<div class="decode-section">
								<h3>Payload</h3>
								<div class="json-display">
									<pre><code>{JSON.stringify(decodedData.payload, null, 2)}</code></pre>
								</div>
							</div>

							<div class="signature-section">
								<h3>Signature</h3>
								<code class="signature-code">{decodedData.signature}</code>
							</div>
						</div>
					{/if}
				</TabsContent>

				<!-- ENCODE TAB -->
				<TabsContent value="encode" class="tabs-content">
					<div class="encode-grid">
						<div class="encode-column">
							<label for="encode-header">Header (JSON)</label>
							<textarea
									id="encode-header"
									bind:value={encodeHeader}
									on:input={syncHeaderToDropdown}
									rows="5"
									spellcheck="false"
							/>
						</div>

						<div class="encode-column">
							<label for="encode-payload">Payload (JSON)</label>
							<textarea
									id="encode-payload"
									bind:value={encodePayload}
									rows="8"
									spellcheck="false"
							/>
						</div>
					</div>

					<div class="encode-options">
						<div class="field">
							<label for="alg">Algorithm</label>
							<select id="alg" bind:value={encodeAlg}>
								<optgroup label="HMAC (Symmetric)">
									<option value="HS256">HS256 (HMAC-SHA256)</option>
									<option value="HS384">HS384 (HMAC-SHA384)</option>
									<option value="HS512">HS512 (HMAC-SHA512)</option>
								</optgroup>
								<optgroup label="RSA (Asymmetric)">
									<option value="RS256">RS256 (RSA-SHA256)</option>
									<option value="RS384">RS384 (RSA-SHA384)</option>
									<option value="RS512">RS512 (RSA-SHA512)</option>
								</optgroup>
								<optgroup label="ECDSA (Asymmetric)">
									<option value="ES256">ES256 (ECDSA P-256)</option>
									<option value="ES384">ES384 (ECDSA P-384)</option>
									<option value="ES512">ES512 (ECDSA P-521)</option>
								</optgroup>
								<optgroup label="No Signature (Testing Only)">
									<option value="none">none (unsigned)</option>
								</optgroup>
							</select>
						</div>

						{#if isHMACAlg}
							<div class="field field-full">
								<label for="secret">
									Signing Secret (kept in your browser, generates token automatically)
								</label>
								<input
										id="secret"
										type="password"
										bind:value={encodeSecret}
										placeholder="Your HMAC secret"
										autocomplete="off"
								/>
							</div>
						{/if}

						{#if isRSAAlg || isECDSAAlg}
							<div class="field field-full">
								<label for="private-key">
									Private Key (PEM PKCS#8 format, kept in your browser)
									<span class="label-hint">
										Required for signing. Generate with OpenSSL or your crypto tools.
									</span>
								</label>
								<textarea
										id="private-key"
										bind:value={encodePrivateKey}
										placeholder="-----BEGIN PRIVATE KEY-----&#10;MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...&#10;-----END PRIVATE KEY-----"
										rows="6"
										spellcheck="false"
										class="key-input"
								/>
							</div>

							<div class="field field-full">
								<label for="public-key">
									Public Key (PEM format, optional)
									<span class="label-hint">
										Not used for encoding, but useful for verification testing.
									</span>
								</label>
								<textarea
										id="public-key"
										bind:value={encodePublicKey}
										placeholder="-----BEGIN PUBLIC KEY-----&#10;MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4...&#10;-----END PUBLIC KEY-----"
										rows="6"
										spellcheck="false"
										class="key-input"
								/>
							</div>
						{/if}

						{#if isNoneAlg}
							<div class="field field-full">
								<div class="info-message">
									<strong>Warning:</strong> The "none" algorithm creates an unsigned token.
									This is only suitable for testing and should never be used in production.
								</div>
							</div>
						{/if}
					</div>

					{#if encodeError}
						<div class="error-message">
							{encodeError}
						</div>
					{/if}

					<div class="results output-container">
						<h3>
							Encoded JWT
							{#if encodedToken}
								(generated in real-time)
							{:else if isHMACAlg}
								(enter secret to generate)
							{:else if isRSAAlg || isECDSAAlg}
								(enter private key to generate)
							{:else}
								(ready to generate)
							{/if}
						</h3>
						<div class="json-display" class:placeholder={!encodedToken}>
							<pre><code>{encodedToken || 'Enter the required fields above to generate a JWT...'}</code></pre>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</Card>
	</div>
</section>

<section class="faq-section">
	<div class="container">
		<h2 class="section-title">Frequently Asked Questions</h2>
		<div class="faq-list">
			{#each faqs as item}
				<div class="faq-item">
					<h3>{item.q}</h3>
					<p>{item.a}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text',
		-apple-system, 'Segoe UI', sans-serif;
		background-color: var(--color-background);
		color: var(--color-foreground);
	}

	.container {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	.hero {
		padding: 2.5rem 0 1.5rem;
		text-align: center;
		background: linear-gradient(
				to bottom,
				var(--color-muted),
				var(--color-background)
		);
	}

	.hero h1 {
		font-size: clamp(2rem, 6vw, 3rem);
		margin-bottom: 1rem;
		line-height: 1.1;
		background: linear-gradient(135deg, var(--color-primary) 0%, #334155 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		font-size: clamp(0.95rem, 3.5vw, 1.1rem);
		max-width: 760px;
		margin: 0 auto;
		color: var(--color-muted-foreground);
	}

	.tool-section {
		padding: 1.5rem 0 2.5rem;
	}

	.tool-card {
		width: 100%;
		box-sizing: border-box;
	}

	.section-title {
		font-size: 1.5rem;
		margin-bottom: 0.4rem;
	}

	.section-subtitle {
		font-size: 0.95rem;
		color: var(--color-muted-foreground);
		margin-bottom: 1.25rem;
	}

	.tabs-root {
		margin-top: 1.25rem;
	}

	.tabs-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tabs-content {
		margin-top: 1.25rem;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	.input-group label {
		display: block;
		margin-bottom: 0.35rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(
				--font-mono,
				ui-monospace,
				SFMono-Regular,
				Menlo,
				Monaco,
				Consolas,
				'Liberation Mono',
				'Courier New',
				monospace
		);
		font-size: 0.85rem;
		resize: vertical;
		min-height: 120px;
		background-color: var(--color-background);
		color: var(--color-foreground);
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.key-input {
		font-size: 0.75rem;
		min-height: 140px;
	}

	.error-message {
		padding: 0.75rem;
		background-color: #fee2e2;
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		color: var(--color-error);
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.error-message.warning {
		background-color: #fef3c7;
		border-color: #f59e0b;
		color: #92400e;
	}

	.info-message {
		padding: 0.75rem;
		background-color: #dbeafe;
		border: 1px solid #3b82f6;
		border-radius: var(--radius-md);
		color: #1e40af;
		font-size: 0.85rem;
	}

	.results {
		margin-top: 1.25rem;
	}

	.results h3 {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.decode-section {
		margin-bottom: 1rem;
	}

	.decode-section h3 {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.output-container {
		min-height: 120px;
	}

	.json-display {
		width: 100%;
		max-height: 320px;
		overflow-x: auto;
		overflow-y: auto;
		background-color: var(--color-muted);
		border-radius: var(--radius-md);
		padding: 0.75rem;
		box-sizing: border-box;
	}

	.json-display.placeholder {
		color: var(--color-muted-foreground);
		font-style: italic;
	}

	.json-display pre {
		margin: 0;
		font-size: 0.8rem;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.signature-section {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--color-border);
	}

	.signature-section h3 {
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
	}

	.signature-code {
		display: block;
		font-size: 0.75rem;
		word-break: break-all;
		padding: 0.6rem;
		background-color: var(--color-muted);
		border-radius: var(--radius-md);
		color: var(--color-muted-foreground);
	}

	.encode-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.encode-column label {
		display: block;
		margin-bottom: 0.35rem;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.encode-options {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0.5rem 0 0.75rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
	}

	.field label {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.label-hint {
		display: block;
		font-weight: 400;
		font-size: 0.8rem;
		color: var(--color-muted-foreground);
		margin-top: 0.15rem;
	}

	.field-full {
		width: 100%;
	}

	select,
	input[type='password'] {
		padding: 0.6rem 0.7rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		background-color: var(--color-background);
		color: var(--color-foreground);
		font-size: 0.85rem;
		box-sizing: border-box;
	}

	select:focus,
	input[type='password']:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.faq-section {
		padding: 0 0 2.5rem;
	}

	.faq-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1rem;
	}

	.faq-item {
		padding: 0.9rem 0.9rem 0.85rem;
		border-radius: var(--radius-md);
		background-color: var(--color-muted);
	}

	.faq-item h3 {
		font-size: 0.95rem;
		margin-bottom: 0.35rem;
	}

	.faq-item p {
		font-size: 0.85rem;
		color: var(--color-muted-foreground);
		margin: 0;
	}

	/* Mobile-first responsiveness */
	@media (max-width: 768px) {
		.tool-card {
			padding: 1rem;
		}

		.encode-grid {
			grid-template-columns: 1fr;
		}

		.faq-list {
			grid-template-columns: 1fr;
		}

		.json-display {
			max-height: 260px;
		}
	}
</style>