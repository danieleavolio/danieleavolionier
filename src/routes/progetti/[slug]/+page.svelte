<script lang="ts">
	import { formatDate } from '$lib/utils';
	import Author from '$lib/components/Author.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import type { Element } from '$lib/types';
	export let data: any;

	let metadata: Element = data.meta;
</script>

<!-- SEO -->

<Seo
	title={metadata.title}
	description={metadata.description}
	image={'https://i.imgur.com/juSgfgF.png'}
	isArticle={true}
	author={'Daniele Avolio'}
	publishDate={metadata.date}
	articleBody={metadata.description}
/>

<article>
	<!-- TITLE -->
	<hgroup>
		<h1>{data.meta.title}</h1>
		<h3>{data.meta.description}</h3>
		<p>Writing date: {formatDate(data.meta.date)}</p>
	</hgroup>

	<!-- tags -->
	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category.toUpperCase()}</span>
		{/each}
	</div>

	<!-- POST -->
	<div class="prose">
		<svelte:component this={data.content} />
	</div>

	<!-- AUTHOR -->
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
	}

	h1 + p {
		margin-top: var(--size-2);
		color: var(--text-2);
	}

	h3 {
		text-transform: none;
		box-shadow: 0 0 0 0 var(--surface-4);
	}

	.prose {
		margin-top: 1rem;
	}

	.tags {
		display: flex;
		gap: var(--size-3);
		margin-top: var(--size-7);
		flex-wrap: wrap;
	}

	.tags > * {
		padding: var(--size-2) var(--size-3);
		border-radius: var(--radious-round);
	}

	hgroup {
		margin-bottom: var(--size-7);
		text-align: center;
	}
</style>
