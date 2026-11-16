<script lang="ts">
	import Seo from './SEO.svelte';
	export let title = '';
	export let author = '';
	export let gameName = '';
	export let gameImage = '';
	export let ratingValue = 0;
	export let reviewBody = '';
</script>

<Seo {title} {author} {gameName} {gameImage} {ratingValue} {reviewBody} isReview />
