<script lang="ts">
	import Author from '$lib/components/Author.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import type { Element } from '$lib/types';
	import * as config from '$lib/config';
	import { formatDate } from '$lib/utils';
	import Tag from '$lib/components/Tag.svelte';
	import ShareComponent from '$lib/components/ShareComponent.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	const siteUrl = config.url.replace(/\/$/, '');
	let metadata: Element = data.meta;
	$: fallbackOg = `${siteUrl}/og/pagine/${data.slug}.svg`;
	$: seoImage = metadata.image || fallbackOg;
</script>

{#if metadata.isReview}
	<Seo
		title={metadata.title}
		description={metadata.description}
		image={seoImage}
		isReview={true}
		gameName={metadata.gameName}
		gameImage={seoImage}
		ratingValue={metadata.ratingValue}
		reviewBody={metadata.reviewBody}
		developer={metadata.developer}
		author={'Daniele Avolio'}
		publishDate={metadata.date}
	/>
{:else}
	<Seo
		title={metadata.title}
		description={metadata.description}
		image={seoImage}
		isArticle={true}
		author={'Daniele Avolio'}
		articleBody={metadata.description}
		publishDate={metadata.date}
	/>
{/if}
<article>
	<hgroup class="review-banner">
		<h1>{data.meta.title}</h1>
		<h3>{data.meta.description}</h3>
		<p>Data: {formatDate(data.meta.date)}</p>
		{#if metadata.gameImage}
			<img class="banner-image" src={seoImage} alt={metadata.title} />
		{/if}
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<Tag {category} from="pagine" />
		{/each}
	</div>

	<div class="prose">
		<svelte:component this={data.content} />
	</div>

	<ShareComponent postTitle={metadata.title} postUrl={$page.url.href} />

	<Author
		name="Daniele"
		surname="Avolio"
		username="lovaion"
		description="Sviluppatore e amante del mondo dei videogiochi 🎮 e della cultura pop giapponese 🗾"
	/>
</article>

<style>
	article {
		max-inline-size: 160cqh;
		margin-inline: auto;
	}

	h1 {
		text-transform: capitalize;
		font-weight: 600;
	}

	h3 {
		text-transform: none;
	}

	.prose {
		margin-top: 1rem;
	}

	.tags {
		display: flex;
		gap: var(--size-3);
		margin-top: var(--size-7);
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	hgroup {
		margin-bottom: var(--size-7);
		text-align: center;
		position: relative;
	}
	.review-banner {
		position: relative;
		padding: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		overflow: hidden;
	}

	.banner-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -1;
		opacity: 0.2;
		filter: blur(3px);
		border-radius: 10px;
		box-shadow: none;
		border: 2px solid var(--automataBlackO);
	}

	.review-banner::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	.review-banner h1,
	.review-banner h3,
	.review-banner p {
		position: relative;
		z-index: 1;
	}
</style>
