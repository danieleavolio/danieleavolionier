<script lang="ts">
	import CategoriesFilter from '$lib/components/CategoriesFilter.svelte';
	import * as config from '$lib/config';
	import type { Element } from '$lib/types.js';
	import { formatDate } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { BoxSelect } from 'lucide-svelte';
	import Seo from '$lib/components/SEO.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import { onMount, tick } from 'svelte';
	import { categoryStore } from '$lib/stores/categoryStore.js';
	export let data;

	let activeFilters: string[] = [];
	let CatFilter: any;

	onMount(() => {
		categoryStore.subscribe((value) => {
			if (value) {
				// Get the value index in the categories array
				let index = categories.indexOf(value);
				// If the string value is not in the CatFilter.activeFilters array, add it
				if (!activeFilters.includes(value)) {
					tick().then(() => {
						CatFilter.clearFilters();
						CatFilter.setActive(index);
						CatFilter.openForce();
						categoryStore.set(null);
					});
				}
			}
		});
	});

	// create event dispatcher
	let categories: string[] = [];
	let postToShow: Element[] = data.posts;
	//For each post, add the tags to the tags array
	data.posts.forEach((post) => {
		post.categories.forEach((tag) => {
			categories.push(tag);
		});
	});

	//Sort the tags array alphabetically
	categories.sort();

	//Create a set to remove duplicates
	categories = [...new Set(categories)];

	const handleFilter = (e: any) => {
		let filters: string[] = e.detail;

		// If there are no filters, show all posts
		if (filters.length === 0) {
			postToShow = data.posts;
			return;
		}

		// Filter posts
		postToShow = data.posts.filter((post) => {
			let postTags = post.categories;
			let matches = 0;

			// For each filter, check if the post has the tag
			filters.forEach((filter: string) => {
				if (postTags.includes(filter)) {
					matches++;
				}
			});

			// If the number of matches is equal to the number of filters, the post has all the tags
			if (matches === filters.length) {
				return true;
			}
		});
	};
</script>

<svelte:head>
	<title>{config.title} Blog</title>
</svelte:head>

<Seo
	title={config.title}
	description="La pagina dei post del blog. Qui potete trovare tutti i post scritti da me medesimo su vari argomenti che vanno dalla programmazione, alle recensioni di videogiochi e fino ad aggiornamenti generici sulla mia vita."
	image="https://i.imgur.com/juSgfgF.png"
	isArticle={false}
/>

<section>
	<ul class="posts">
		{#each postToShow as post, i}
			<li transition:slide class="post">
				<a href="pagine/{post.slug}" class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
				<div class="tags">
					{#each post.categories as category}
						<Tag
							from="pagine"
							{category}
							isActive={activeFilters.includes(category)}
						/>
					{/each}
				</div>
			</li>
		{/each}
		{#if postToShow.length == 0}
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
