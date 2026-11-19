<script lang="ts">
	import { formatDate } from '#lib/utils.ts';
	import CategoriesFilter from '#lib/components/CategoriesFilter.svelte';
	import type { Element } from '#lib/types.ts';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { useI18n } from '#lib/i18n.ts';

	const { t } = useI18n();
	import { slide } from 'svelte/transition';
	import Seo from '#lib/components/SEO.svelte';
	import { projectsCategoryStore } from '#lib/stores/categoryStore.ts';
	import { onMount, tick } from 'svelte';
	import Tag from '#lib/components/Tag.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let activeFilters: string[] = [];
	let CatFilter: CategoriesFilter;
	let categories: string[] = [];
	const allProjects: Element[] = Array.isArray(data.progetti) ? data.progetti : [];
	let projectToShow: Element[] = allProjects;

	onMount(() => {
		const unsubscribe = projectsCategoryStore.subscribe((value) => {
			if (value) {
				const index = categories.indexOf(value);
				if (!activeFilters.includes(value) && index >= 0) {
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

	allProjects.forEach((progetto) => {
		const projectCategories = Array.isArray(progetto.categories) ? progetto.categories : [];
		projectCategories.forEach((tag) => {
			categories.push(tag);
		});
	});
	categories.sort();
	categories = [...new Set(categories)];

	const getCategories = (project: Element) =>
		Array.isArray(project.categories) ? project.categories : [];

	const handleFilter = (e: CustomEvent<string[]>) => {
		const filters = e.detail;

		if (filters.length === 0) {
			projectToShow = allProjects;
			return;
		}

		projectToShow = allProjects.filter((progetto) => {
			const projectCategories = getCategories(progetto);
			const matches = filters.filter((filter) => projectCategories.includes(filter)).length;
			return matches === filters.length;
		});
	};
</script>

<Seo
	title="Progetti & Portfolio Software"
	description="Raccolta dei progetti software, web app, esperimenti AI e videogiochi realizzati da Daniele Avolio."
	image="https://i.imgur.com/juSgfgF.png"
/>

<h1 class="sr-only">Progetti e portfolio software</h1>
<section>
	<ul class="posts">
		{#each projectToShow as progetto (progetto.slug)}
			<li transition:slide class="post">
				<a href={`/progetti/${progetto.slug}`} class="title">{progetto.title}</a>
				<p class="date">{formatDate(progetto.date)}</p>
				<p class="description">{progetto.description}</p>
				<div class="tags">
					{#each getCategories(progetto) as category, index (index)}
						<Tag {category} from="progetti" isActive={activeFilters.includes(category)} />
					{/each}
				</div>
			</li>
		{/each}
		{#if projectToShow.length === 0}
			<h1>{$t('no_projects')} <Icon name="empty" size={30} /></h1>
		{/if}
	</ul>

	<div class="filter-column">
		<CategoriesFilter
			bind:activeFilters
			bind:this={CatFilter}
			{categories}
			on:filter={handleFilter}
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
		flex-direction: column-reverse;
		gap: 2em;
		justify-content: space-between;
	}
	a {
		z-index: 10;
	}
	.post {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		overflow-wrap: anywhere;
		gap: 1.2rem;
		box-sizing: border-box;
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--yr-line);
		background-color: var(--yr-surface);
		box-shadow: var(--yr-shadow);
		background-image: none;
		max-inline-size: none;
		transition: background-color 0.15s ease;
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
</style>
