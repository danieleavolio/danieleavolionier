<script lang="ts">
	import { page } from '$app/stores';

	// Props comuni per qualsiasi pagina
	export let title = '';
	export let description = '';
	export let image = '';
	export let isArticle = false;
	export let author = '';
	export let articleBody = '';

	// Props specifici per recensioni di videogiochi
	export let isReview = false;
	export let gameName = '';
	export let gameImage = '';
	export let ratingValue = 0;
	export let reviewBody = '';
	export let developer = '';

	// Recupera dinamicamente l'URL corrente dal router di SvelteKit
	let currentUrl: string;
	$: {
		currentUrl = $page.url.href;
	}
</script>

<svelte:head>
	<!-- Meta Tag Comuni -->
	<title>{title}</title>
	<meta name="description" content={isReview ? reviewBody : description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={isReview ? reviewBody : description} />
	<meta property="og:type" content={isArticle ? 'article' : isReview ? 'review' : 'website'} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:image" content={isReview ? gameImage : image} />
	<meta name="twitter:image" content={isReview ? gameImage : image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={isReview ? reviewBody : description} />

	<!-- JSON-LD Schema -->
	{#if isArticle}
		<!-- Schema per un articolo -->
		{@html `
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${currentUrl}"
				},
			"headline": "${title}",
			"image": ["${image}"],
			"author": {
				"@type": "Person",
				"name": "${author}"
				},
			"publisher": {
				"@type": "Organization",
				"name": "${author} Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://i.imgur.com/HjK8Wmp.png"
					}
				},
			"description": "${description}",
			"articleBody": "${articleBody}"
		}
		</script>
		`}
	{:else if isReview}
		<!-- Schema per una recensione -->
		{@html `
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Review",
			"image": "${gameImage}",
			"itemReviewed": {
				"@type": "VideoGame",
				"name": "${gameName}",
				"image": "${gameImage}",
				"author": "${developer}"
			},
			"author": {
				"@type": "Person",
				"name": "${author}",
				"url": "https://www.danieleavolio.it"
			},
			"reviewRating": {
				"@type": "Rating",
				"ratingValue": "${ratingValue}",
				"bestRating": "10",
				"worstRating": "0"
			},
			"publisher": {
				"@type": "Organization",
				"name": "${author}"
			},
			"reviewBody": "${reviewBody}"
		}
		</script>
		`}
	{:else}
		<!-- Schema per una pagina generica -->
		{@html `
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${title}",
			"description": "${description}",
			"url": "${currentUrl}",
			"image": "${image}"
		}
		</script>
		`}
	{/if}
</svelte:head>
