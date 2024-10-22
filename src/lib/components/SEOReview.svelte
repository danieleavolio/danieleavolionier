<script lang="ts">
	export let title = '';
	export let author = '';
	export let gameName = '';
	export let gameImage = '';
	export let ratingValue = 0;
	export let reviewBody = '';
	export let platform = '';
	export let datePublished = '';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={reviewBody} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={reviewBody} />
	<meta property="og:type" content="review" />
	<meta property="og:image" content={gameImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={reviewBody} />
	<meta name="twitter:image" content={gameImage} />

	{@html `
    <script type="application/ld+json">{
      "@context": "https://schema.org",
      "@type": "Review",
      "image": "${gameImage}",
      "itemReviewed": {
        "@type": "VideoGame",
        "name": "${gameName}",
        "image": "${gameImage}",
        "author": "Platinum Games",
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
</svelte:head>
