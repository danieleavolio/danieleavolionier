<script lang="ts">
	import { formatDate } from '#lib/utils.ts';
	import Author from '#lib/components/Author.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import * as config from '#lib/config.ts';
	import Tag from '#lib/components/Tag.svelte';
	import RichContent from '#lib/components/RichContent.svelte';
	import ReadingWidth from '#lib/components/ReadingWidth.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const siteUrl = config.url.replace(/\/$/, '');
	$: metadata = data.meta;
	$: faq =
		((metadata.metadata as Record<string, unknown> | undefined)?.faq as Array<{
			question: string;
			answer: string;
		}>) ?? [];
	$: metadataCategories = Array.isArray(metadata.categories) ? metadata.categories : [];
	$: fallbackOg = `${siteUrl}/og/progetti/${data.slug}.png`;
	$: seoImage = metadata.image || fallbackOg;
</script>

<Seo
	title={metadata.title}
	description={metadata.description}
	image={seoImage}
	isArticle={true}
	author="Daniele Avolio"
	publishDate={metadata.date}
	dateModified={metadata.updatedAt || metadata.date}
	articleBody={metadata.description}
	{faq}
/>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<h3>{data.meta.description}</h3>
		<p>Data: {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each metadataCategories as category, index (index)}
			<Tag {category} from="progetti" />
		{/each}
	</div>

	{#if metadata.image}
		<img class="cover-image" src={metadata.image} alt={metadata.title} />
	{/if}

	<ReadingWidth />

	<RichContent html={data.contentHtml} />

	<Author
		name="Daniele"
		surname="Avolio"
		username="lovaion"
		description="Sviluppatore e amante del mondo dei videogiochi 🎮 e della cultura pop giapponese 🗾"
	/>
</article>

<style>
	.cover-image {
		display: block;
		width: 100%;
		height: auto;
		margin: clamp(2rem, 5vw, 3.5rem) auto var(--size-7);
		border-radius: 10px;
		border: 2px solid var(--automataBlackO);
		object-fit: cover;
	}

	article {
		max-inline-size: var(--reading-width, 100%);
		margin-inline: auto;
	}

	h1 {
		text-transform: capitalize;
		font-weight: 600;
	}

	h3 {
		text-transform: none;
	}

	.tags {
		display: flex;
		gap: var(--size-3);
		margin-top: 0;
		margin-bottom: var(--size-8);
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	hgroup {
		margin-bottom: var(--size-5);
		text-align: center;
	}
</style>
