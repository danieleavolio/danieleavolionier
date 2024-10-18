<script lang="ts">
	import { page } from '$app/stores';
 // Importa lo store di SvelteKit per ottenere l'URL corrente

	// Props comuni per qualsiasi pagina
	export let title = '';
	export let description = '';
	export let image = '';

	// Props specifici per articoli/blog post (facoltativi)
	export let isArticle = false; // Booleano per indicare se è un blog post o una pagina generica
	export let author = '';
	export let publishDate = '';
	export let modifiedDate = '';
	export let articleBody = '';

	// Recupera dinamicamente l'URL corrente dal router di SvelteKit
	let currentUrl: string;
	$: {
		currentUrl = $page.url.href;
	}
</script>

<svelte:head>
	<!-- Meta Tag Comuni -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={isArticle ? 'article' : 'website'} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- JSON-LD Schema -->
	{#if isArticle}
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
			"datePublished": "${publishDate}",
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
		}
		</script>
	`}
	{:else}
		{@html `
		<script type="application/ld+json">
		{
			{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "${title}",
			"description": "${description}",
			"url": "${currentUrl}",
			"image": "${image}"
			}
		}
		</script>
	`}
	{/if}
</svelte:head>
