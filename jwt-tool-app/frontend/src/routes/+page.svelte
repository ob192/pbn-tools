<script lang="ts">
	// import Hero from '$lib/components/Hero.svelte';
	import Main from '$lib/components/Main.svelte';
	// import JWTDecoder from '$lib/components/JWTDecoder.svelte';
	// import BlogPreview from '$lib/components/BlogPreview.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>JWT/JWE Decoder - Secure Token Inspector</title>
	<meta
		name="description"
		content="Decode and inspect JWT and JWE tokens instantly. Secure, privacy-friendly tool for developers with client-side processing."
	/>
	<meta property="og:title" content="JWT/JWE Decoder - Secure Token Inspector" />
	<meta
		property="og:description"
		content="Decode and inspect JWT and JWE tokens instantly. Secure, privacy-friendly tool for developers."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Main />
<!--<JWTDecoder />-->
<!--<BlogPreview posts={data.posts} />-->