<script lang="ts">
	import CategoriesFilter from '$lib/components/CategoriesFilter.svelte';
	import * as config from '$lib/config';
	import type { Element, FaqItem } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { BoxSelect } from 'lucide-svelte';
	import Seo from '$lib/components/SEO.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import { onMount, tick } from 'svelte';
	import { categoryStore } from '$lib/stores/categoryStore.js';
	import type { PageData } from './$types';

	export let data: PageData;

	const faqItems: FaqItem[] = [
		{
			question: 'Come cerco articoli per argomento?',
			answer:
				'Puoi usare il filtro categorie per restringere i post su temi come SvelteKit, programmazione, recensioni e AI.'
		},
		{
			question: 'I post sono ordinati per data?',
			answer: 'Si, i contenuti vengono mostrati dal piu recente al piu vecchio.'
		}
	];

	let activeFilters: string[] = [];
	let CatFilter: any;
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
	title={config.title}
	description="La pagina dei post del blog. Qui trovi articoli su sviluppo web, intelligenza artificiale, recensioni e aggiornamenti personali."
	image="https://i.imgur.com/juSgfgF.png"
	{faqItems}
/>

<section>
	<ul class="posts">
		{#each postToShow as post}
			<li transition:slide class="post">
				<a href={`/pagine/${post.slug}`} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
				<div class="tags">
					{#each getCategories(post) as category}
						<Tag from="pagine" {category} isActive={activeFilters.includes(category)} />
					{/each}
				</div>
			</li>
		{/each}
		{#if postToShow.length === 0}
			<h1>Nessun post trovato! <BoxSelect size="2em" /></h1>
		{/if}
	</ul>
	<CategoriesFilter
		bind:this={CatFilter}
		bind:activeFilters
		{categories}
		on:filter={(e) => handleFilter(e)}
	/>
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
		display: grid;
		gap: 2rem;
	}

	.post:not(:last-child) {
		padding-bottom: var(--size-7);
	}

	.title {
		font-size: var(--font-size-fluid-2);
		text-transform: capitalize;
	}

	.date {
		color: var(--text-2);
	}

	.description {
		margin-top: var(--size-3);
	}

	.tags {
		display: flex;
		gap: 0.5em;
		margin-top: var(--size-3);
		flex-wrap: wrap;
	}

	@media (min-width: 1000px) {
		section {
			flex-direction: row;
			align-items: start;
		}
	}
</style>
