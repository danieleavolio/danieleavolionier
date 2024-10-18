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
	{@html `
    <script type="application/ld+json">
      {
      {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "VideoGame",
          "name": "${gameName}",
          "image": "${gameImage}",
          "author": "Platinum Games",
          "datePublished": "${datePublished}",
          "platform": "${platform}"
        },
        "author": {
          "@type": "Person",
          "name": "${author}"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "${ratingValue}",
          "bestRating": "10"
        },
        "publisher": {
          "@type": "Organization",
          "name": "${author} Reviews"
        },
        "reviewBody": "${reviewBody}"
      }
      }
    </script>
    `}
</svelte:head>
