<script lang="ts">
	import { formatDate } from '$lib/utils';
	import Author from '$lib/components/Author.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import type { Element } from '$lib/types';
	import * as config from '$lib/config';
	import Tag from '$lib/components/Tag.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const siteUrl = config.url.replace(/\/$/, '');
	let metadata: Element = data.meta;
	$: fallbackOg = `${siteUrl}/og/progetti/${data.slug}.svg`;
	$: seoImage = metadata.image || fallbackOg;
</script>

<Seo
	title={metadata.title}
	description={metadata.description}
	image={seoImage}
	isArticle={true}
	author={'Daniele Avolio'}
	publishDate={metadata.date}
	articleBody={metadata.description}
/>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<h3>{data.meta.description}</h3>
		<p>Data: {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<Tag {category} from="progetti" />
		{/each}
	</div>

	<div class="prose">
		<svelte:component this={data.content} />
	</div>

	<Author
		name="Daniele"
		surname="Avolio"
		username="lovaion"
		description="Sviluppatore e amante del mondo dei videogiochi 🎮 e della cultura pop giapponese 🗾"
	/>
</article>

<style>
	article {
		max-inline-size: 120ch;
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
	}
</style>
