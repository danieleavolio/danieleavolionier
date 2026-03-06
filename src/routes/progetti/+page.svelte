<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	import CategoriesFilter from '$lib/components/CategoriesFilter.svelte';
	import type { Element, FaqItem } from '$lib/types';
	import { BoxSelect } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import Seo from '$lib/components/SEO.svelte';
	import { projectsCategoryStore } from '$lib/stores/categoryStore';
	import { onMount, tick } from 'svelte';
	import Tag from '$lib/components/Tag.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const faqItems: FaqItem[] = [
		{
			question: 'Che tipo di progetti trovo in questa pagina?',
			answer:
				'Trovi progetti web, data e software engineering con descrizione tecnica e tecnologie usate.'
		},
		{
			question: 'Posso filtrare i progetti per tecnologia?',
			answer: 'Si, puoi filtrare i progetti per categoria usando il pannello filtri laterale.'
		}
	];

	let activeFilters: string[] = [];
	let CatFilter: any;
	let categories: string[] = [];
	let projectToShow: Element[] = data.progetti;

	onMount(() => {
		const unsubscribe = projectsCategoryStore.subscribe((value) => {
			if (value) {
				const index = categories.indexOf(value);
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

		return unsubscribe;
	});

	data.progetti.forEach((progetto) => {
		progetto.categories.forEach((tag) => {
			categories.push(tag);
		});
	});
	categories.sort();
	categories = [...new Set(categories)];

	const handleFilter = (e: CustomEvent<string[]>) => {
		const filters = e.detail;

		if (filters.length === 0) {
			projectToShow = data.progetti;
			return;
		}

		projectToShow = data.progetti.filter((progetto) => {
			const matches = filters.filter((filter) => progetto.categories.includes(filter)).length;
			return matches === filters.length;
		});
	};
</script>

<Seo
	title={config.title}
	description="La pagina che contiene tutti i miei progetti: lavori completati, esperimenti tecnici e prototipi in corso."
	image="https://i.imgur.com/juSgfgF.png"
	{faqItems}
/>

<section>
	<ul class="posts">
		{#each projectToShow as progetto}
			<li transition:slide class="post">
				<a href={`/progetti/${progetto.slug}`} class="title">{progetto.title}</a>
				<p class="date">{formatDate(progetto.date)}</p>
				<p class="description">{progetto.description}</p>
				<div class="tags">
					{#each progetto.categories as category}
						<Tag {category} from="progetti" isActive={activeFilters.includes(category)} />
					{/each}
				</div>
			</li>
		{/each}
		{#if projectToShow.length === 0}
			<h1>Nessun progetto trovato! <BoxSelect size="2em" /></h1>
		{/if}
	</ul>

	<CategoriesFilter
		bind:activeFilters
		bind:this={CatFilter}
		{categories}
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

	@media (min-width: 768px) {
		section {
			flex-direction: row;
			align-items: start;
		}
	}
</style>
