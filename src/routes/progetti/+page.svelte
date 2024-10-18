<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	import CategoriesFilter from '$lib/components/CategoriesFilter.svelte';
	import type { Element } from '$lib/types.js';
	import { BoxSelect } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import Seo from '$lib/components/SEO.svelte';
	import { projectsCategoryStore } from '$lib/stores/categoryStore';
	import { onMount, tick } from 'svelte';
	import Tag from '$lib/components/Tag.svelte';

	export let data: any;


	let activeFilters: string[] = [];
	let CatFilter: any;


	onMount(() => {
		projectsCategoryStore.subscribe((value) => {
			if (value) {
				let index = categories.indexOf(value);
				if (!activeFilters.includes(value)) {
					tick().then(() => {
						CatFilter.clearFilters();
						CatFilter.setActive(index);
						CatFilter.openForce();
						projectsCategoryStore.set(null);
					});
				}
			}
		});
	});


	let categories: string[] = [];
	let projectToShow: Element[] = data.progetti;
	data.progetti.forEach((progetto: { categories: any[] }) => {
		progetto.categories.forEach((tag) => {
			categories.push(tag);
		});
	});
	categories.sort();
	//Remove duplicates
	categories = [...new Set(categories)];

	const handleFilter = (e: any) => {
		let filters: string[] = e.detail;

		if (filters.length === 0) {
			projectToShow = data.progetti;
			return;
		}

		projectToShow = data.progetti.filter((progetto: { categories: any }) => {
			let progettoTags = progetto.categories;
			let matches = 0;

			filters.forEach((filter: string) => {
				if (progettoTags.includes(filter)) {
					matches++;
				}
			});

			if (matches === filters.length) {
				return true;
			}
		});
	};
</script>

<Seo
	title={config.title}
	description="La pagina che contiene tutti i miei progetti. Qui puoi trovare i progetti che ho realizzato, i progetti che sto realizzando e i progetti che realizzerò."
	image="https://i.imgur.com/juSgfgF.png"
/>

<section>
	<ul class="posts">
		{#each projectToShow as progetto}
			<li transition:slide class="post">
				<a href="progetti/{progetto.slug}" class="title">{progetto.title}</a>
				<p class="date">{formatDate(progetto.date)}</p>
				<p class="description">{progetto.description}</p>
				<div class="tags">
					{#each progetto.categories as category}
						<Tag category={category} from="progetti" isActive={activeFilters.includes(category)} />
					{/each}
				</div>
			</li>
		{/each}
		{#if projectToShow.length == 0}
			<h1>Nessun progetto trovato! <BoxSelect size="2em" /></h1>
		{/if}
	</ul>

	<CategoriesFilter
		bind:activeFilters
		bind:this={CatFilter}
		categories={categories}
		on:filter={handleFilter}
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
		flex-direction: column-reverse;
		gap: 2em;
		justify-content: space-between;
	}
	a {
		z-index: 10;
	}
	.post {
		display: grid;
		gap: 1.2rem;
		transition: all 0.5s ease-in-out;
	}

	.post:not(:last-child) {
		padding-bottom: var(--size-7);
	}

	.post:hover {
		background-color: var(--automataBg);
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

	.tag {
		background-color: var(--automataColor);
		color: var(--automataBg);
		padding: 0.2em 0.5em;
	}

	@media (min-width: 768px) {
		section {
			flex-direction: row;
			align-items: start;
		}
	}
</style>
