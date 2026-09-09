<script lang="ts">
	import Seo from '$lib/components/SEO.svelte';
	import type { NowItem } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;
	$: items = (data.items ?? []) as NowItem[];
	$: grouped = items.reduce<Record<string, NowItem[]>>((acc, item) => {
		(acc[item.category] ??= []).push(item);
		return acc;
	}, {});
</script>

<Seo
	title="Now | Daniele Avolio"
	description="Cosa sto facendo, studiando e costruendo in questo periodo."
	image="https://i.imgur.com/juSgfgF.png"
/>

<article class="now-page">
	<header>
		<p class="eyebrow">NOW</p>
		<h1>Cosa sto facendo adesso</h1>
		<p class="lead">
			Una fotografia aggiornata dei progetti, delle idee e delle cose che sto imparando.
		</p>
	</header>

	{#if items.length === 0}
		<p class="empty">Nessun aggiornamento pubblicato al momento.</p>
	{:else}
		{#each Object.entries(grouped) as [category, categoryItems]}
			<section aria-labelledby={category}>
				<h2 id={category}>{category}</h2>
				<div class="items">
					{#each categoryItems as item}
						<article
							class:completed={item.status === 'completed'}
							class:paused={item.status === 'paused'}
						>
							<div class="item-heading">
								<span class="status" aria-label={item.status}></span>
								<h3>{item.title}</h3>
							</div>
							<p>{item.description}</p>
							{#if item.link}
								<a href={item.link} target="_blank" rel="noreferrer">Apri collegamento</a>
							{/if}
						</article>
					{/each}
				</div>
			</section>
		{/each}
	{/if}
</article>

<style>
	.now-page {
		max-inline-size: 900px;
		margin-inline: auto;
	}

	header {
		margin-bottom: var(--size-9);
		text-align: center;
	}

	.eyebrow {
		font-family: var(--font-mono);
		letter-spacing: 0.2rem;
		opacity: 0.7;
	}

	h1 {
		margin-block: var(--size-3);
	}

	.lead {
		font-size: var(--font-size-fluid-1);
	}

	section {
		margin-block: var(--size-8);
	}

	h2 {
		text-align: left;
		text-transform: none;
		font-size: var(--font-size-fluid-2);
		letter-spacing: 0.1rem;
	}

	.items {
		display: grid;
		gap: var(--size-4);
	}

	.items article {
		padding: var(--size-5);
		border-left: 3px solid var(--automataColor);
		background: var(--automataBgOpacity);
	}

	.item-heading {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	h3 {
		margin: 0;
		text-transform: none;
		letter-spacing: 0.05rem;
	}

	.status {
		width: 0.75rem;
		height: 0.75rem;
		flex: 0 0 auto;
		border-radius: 50%;
		background: var(--automataRed);
	}

	.completed .status {
		background: var(--automataColor);
	}

	.paused .status {
		background: var(--automataYellow);
	}

	.items p {
		line-height: 1.7;
	}

	a {
		font-size: 0.9rem;
		text-transform: none;
		letter-spacing: normal;
		padding: 0;
		background: transparent;
		text-decoration: underline;
	}

	.empty {
		padding: var(--size-7);
		text-align: center;
		background: var(--automataBgOpacity);
	}
</style>
