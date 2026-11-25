<script lang="ts">
	import CategoriesFilter from '#lib/components/CategoriesFilter.svelte';
	import type { Element } from '#lib/types.ts';
	import { formatDate, calculateReadingTime } from '#lib/utils.ts';
	import { slide } from 'svelte/transition';
	import Icon from '#lib/components/ui/Icon.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import Tag from '#lib/components/Tag.svelte';
	import { onMount, tick } from 'svelte';
	import { categoryStore } from '#lib/stores/categoryStore.js';
	import type { PageData } from './$types';

	export let data: PageData;

	let activeFilters: string[] = [];
	let CatFilter: CategoriesFilter;
	let categories: string[] = [];
	const allPosts: Element[] = Array.isArray(data.posts) ? data.posts : [];
	let postToShow: Element[] = allPosts;

	onMount(() => {
		const unsubscribe = categoryStore.subscribe((value) => {
			if (value) {
				const index = categories.indexOf(value);
				if (!activeFilters.includes(value) && index >= 0) {
					tick().then(() => {
						CatFilter.clearFilters();
						CatFilter.setActive(index);
						CatFilter.openForce();
						categoryStore.set(null);
					});
				}
			}
		});

		return unsubscribe;
	});

	allPosts.forEach((post) => {
		const postCategories = Array.isArray(post.categories) ? post.categories : [];
		postCategories.forEach((tag) => {
			categories.push(tag);
		});
	});
	categories.sort();
	categories = [...new Set(categories)];

	const getCategories = (post: Element) => (Array.isArray(post.categories) ? post.categories : []);

	const handleFilter = (e: CustomEvent<string[]>) => {
		const filters = e.detail;

		if (filters.length === 0) {
			postToShow = allPosts;
			return;
		}

		postToShow = allPosts.filter((post) => {
			const postCategories = getCategories(post);
			const matches = filters.filter((filter) => postCategories.includes(filter)).length;
			return matches === filters.length;
		});
	};
</script>

<Seo
	title="Blog & Articoli Tecnici"
	description="Articoli, tutorial e approfondimenti su sviluppo web, frontend, intelligenza artificiale e programmazione scritti da Daniele Avolio."
/>

<h1 class="sr-only">Blog e articoli tecnici</h1>
<section>
	<ul class="posts">
		{#each postToShow as post (post.slug)}
			<li transition:slide class="post">
				<a href={`/pagine/${post.slug}`} class="title">{post.title}</a>
				<p class="date">
					{formatDate(post.date)} · {post.readingTime ?? calculateReadingTime(post.description)} min lettura
				</p>
				<p class="description">{post.description}</p>
				<div class="tags">
					{#each getCategories(post) as category, index (index)}
						<Tag from="pagine" {category} isActive={activeFilters.includes(category)} />
					{/each}
				</div>
			</li>
		{/each}
		{#if postToShow.length === 0}
			<h1>Nessun post trovato! <Icon name="empty" size={30} /></h1>
		{/if}
	</ul>
	<div class="filter-column">
		<CategoriesFilter
			bind:this={CatFilter}
			bind:activeFilters
			{categories}
			on:filter={(e) => handleFilter(e)}
		/>
	</div>
</section>

<style>
	h1 {
		display: flex;
		align-items: center;
		gap: 0.2em;
		padding: 0.19em;
	}
	section {
		display: flex;
		gap: 2rem;
		justify-content: space-between;
		flex-direction: column-reverse;
	}
	.post {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		overflow-wrap: anywhere;
		gap: 2rem;
		box-sizing: border-box;
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--yr-line);
		background-color: var(--yr-surface);
		box-shadow: var(--yr-shadow);
		background-image: none;
		max-inline-size: none;
	}
	.posts {
		display: grid;
		gap: 1.25rem;
		min-width: 0;
	}

	.post:not(:last-child) {
		padding-bottom: 1.1rem;
	}

	.post:hover,
	.post:focus-within {
		border-color: var(--automataColor);
		background-color: var(--automataColor);
		color: var(--automataBg);
	}

	.post:hover .date,
	.post:hover .description,
	.post:focus-within .date,
	.post:focus-within .description {
		color: inherit;
	}

	.post:hover .title,
	.post:focus-within .title,
	.post:hover :global(.tag),
	.post:focus-within :global(.tag) {
		color: var(--automataBg) !important;
	}

	.post:hover :global(.tag),
	.post:focus-within :global(.tag) {
		border-color: var(--automataBg) !important;
	}

	.title {
		position: static;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: fit-content;
		padding: 0;
		background-color: transparent;
		text-align: left;
		text-shadow: none;
		font-size: var(--font-size-fluid-2);
		text-transform: capitalize;
	}

	.title::before {
		content: '';
		position: static;
		display: inline-block;
		flex: 0 0 auto;
		width: 0.55rem;
		height: 0.55rem;
		margin-right: 0;
		background-color: currentColor;
	}

	.title::after {
		content: '';
		display: block;
		position: absolute;
		inset: 0;
		width: auto;
		height: auto;
		background: transparent;
		z-index: 1;
		cursor: pointer;
	}

	.title:hover,
	.title:focus-visible {
		background-color: transparent;
		border-color: transparent;
		color: inherit !important;
	}

	.title:hover::before {
		width: 0.55rem;
	}

	.date {
		color: var(--text-2);
	}

	.description {
		margin-top: var(--size-3);
	}

	@media (max-width: 700px) {
		.post {
			gap: 0.9rem;
			padding: 0.9rem;
		}

		.title {
			font-size: 1.35rem;
			letter-spacing: 0.12rem;
		}
	}

	.tags {
		position: relative;
		z-index: 2;
		display: flex;
		gap: 0.5em;
		margin-top: var(--size-3);
		flex-wrap: wrap;
	}

	.filter-column {
		width: 100%;
		min-width: 0;
	}

	@media (min-width: 1000px) {
		section {
			flex-direction: row;
			align-items: start;
		}

		.posts {
			flex: 1 1 auto;
		}

		.filter-column {
			flex: 0 0 240px;
			width: 240px;
		}
	}

	@media (min-width: 1500px) {
		.posts {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1rem;
			align-items: stretch;
		}

		.post {
			margin: 0;
			gap: 0.6rem;
			padding: 1rem 1.2rem;
			align-content: start;
		}

		.post:not(:last-child) {
			padding-bottom: 1rem;
		}

		.title {
			font-size: 1.6rem;
		}

		.description,
		.tags {
			margin-top: 0;
		}

		.posts > h1 {
			grid-column: 1 / -1;
		}
	}
</style>
