<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { Element } from '#lib/types.ts';
	import Profile from './profile.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import { formatDate } from '#lib/utils.ts';

	export let data: PageData;

	let items_container: HTMLElement;
	let totalPassword = '';

	$: posts = Array.isArray(data.posts) ? data.posts : [];
	$: projects = Array.isArray(data.progetti) ? data.progetti : [];
	$: latestPosts = posts.slice(0, 3);
	$: latestProjects = projects.slice(0, 3);

	onMount(() => {
		const handleMousemove = (e: MouseEvent) => {
			const rect = items_container.getBoundingClientRect();
			const left = e.clientX - rect.left;
			const top = e.clientY - rect.top;
			items_container.style.setProperty('--left', `${left}px`);
			items_container.style.setProperty('--top', `${top}px`);
		};

		const handleKeydown = (e: KeyboardEvent) => {
			totalPassword += e.key;

			if (totalPassword.includes('endofthelova')) {
				window.location.href = '/end-of-the-lova';
			}

			if (totalPassword.toLowerCase().includes('logins')) {
				window.location.href = '/admin';
			}

			if (e.key === '0') {
				totalPassword = '';
			}
		};

		items_container.addEventListener('mousemove', handleMousemove);
		window.addEventListener('keydown', handleKeydown);

		return () => {
			items_container.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const categoryList = (item: Element) => (Array.isArray(item.categories) ? item.categories : []);
</script>

<Seo
	title="Daniele Avolio - Data Engineer @ AgileLab"
	description="Daniele Avolio - Data Engineer @ AgileLab. Laureato magistrale in Informatica e AI all'Unical. Specializzato in Apache Spark, Databricks, GCP, Airflow e sviluppo web."
	image="https://i.imgur.com/juSgfgF.png"
/>

<h1 class="sr-only">Daniele Avolio - Data Engineer @ AgileLab</h1>
<div class="separator">
	<section class="section-1">
		<ul class="hero-list">
			<li class="post">
				<div bind:this={items_container} class="items-container">
					<a href="/pagine" class="title">Blog</a>
					<a href="/progetti" class="title">Progetti</a>
					<a href="/data" class="title">Data</a>
					<a href="/appunti" class="title">Appunti</a>
				</div>
			</li>
		</ul>
	</section>
	<section class="section-2"><Profile /></section>
</div>

<section class="latest-grid">
	<article class="latest-panel yr-panel">
		<h2 class="yr-panel__head">
			<span class="yr-panel__square" aria-hidden="true"></span>Ultimi articoli
		</h2>
		<ul class="yr-panel__body">
			{#each latestPosts as post (post.slug)}
				<li class="yr-item">
					<a href={`/pagine/${post.slug}`}>{post.title}</a>
					<p>{formatDate(post.date)}</p>
					{#if categoryList(post).length}
						<small>{categoryList(post).join(' · ')}</small>
					{/if}
				</li>
			{/each}
		</ul>
	</article>

	<article class="latest-panel yr-panel">
		<h2 class="yr-panel__head">
			<span class="yr-panel__square" aria-hidden="true"></span>Ultimi progetti
		</h2>
		<ul class="yr-panel__body">
			{#each latestProjects as project (project.slug)}
				<li class="yr-item">
					<a href={`/progetti/${project.slug}`}>{project.title}</a>
					<p>{formatDate(project.date)}</p>
					{#if categoryList(project).length}
						<small>{categoryList(project).join(' · ')}</small>
					{/if}
				</li>
			{/each}
		</ul>
	</article>
</section>

<style>
	a {
		position: relative;
		font-size: var(--font-size-fluid-1) !important;
		padding-left: 1em;
		text-align: left;
		display: flex;
		gap: 0.2em;
	}

	li {
		display: flex !important;
		align-items: center;
		padding: 0;
		width: 100%;
		background-image: none;
		margin-bottom: 0;
		max-inline-size: none;
	}

	.separator {
		display: flex;
		flex-direction: column-reverse;
		justify-content: space-around;
		align-items: center;
		gap: 4rem;
	}

	.hero-list {
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.section-1 {
		width: 100%;
		height: fit-content;
		flex: 2 1 20em;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.section-2 {
		min-width: 0;
		max-width: 100%;
		justify-content: center;
		align-items: center;
	}

	.items-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		padding: 2em;
		background-color: var(--automataBgOpacity);
		z-index: 10;
		width: 100%;
		--left: 0px;
		--top: 0px;
		position: relative;
		overflow: hidden;
	}

	.items-container::before {
		content: '';
		background: var(--automataBgOpacity);
		border-radius: 50%;
		width: 15rem;
		height: 15rem;
		position: absolute;
		left: var(--left);
		top: var(--top);
		transform: translate(-50%, -50%) scale(1.5);
		z-index: -1;
		filter: blur(50px);
		opacity: 0;
		transition: opacity 0.1s ease-in-out;
	}

	.items-container:hover::before {
		opacity: 1;
	}

	.title {
		font-size: var(--font-size-fluid-2);
		text-transform: none;
	}

	.items-container a::before {
		content: '';
		position: static;
		z-index: auto;
		display: block;
		flex: 0 0 auto;
		width: 0.75rem;
		height: 0.75rem;
		background-color: var(--automataColor);
	}

	.items-container a {
		align-items: center;
		gap: 0.75rem;
		text-shadow: none;
	}

	.items-container a:hover,
	.items-container a:focus-visible {
		background-color: var(--automataColor);
		border-color: var(--automataColor);
		color: var(--automataBg) !important;
	}

	.items-container a:hover::before,
	.items-container a:focus-visible::before {
		background-color: var(--automataBg);
	}

	.latest-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.latest-panel {
		min-width: 0;
	}

	.latest-panel h2 {
		margin-bottom: 0;
	}

	.latest-panel ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.latest-panel li {
		position: relative;
		display: block !important;
		width: auto;
		padding: 0.7rem 0.8rem 0.7rem 1.7rem;
		margin-bottom: 0;
		background-image: none;
	}

	.latest-panel a {
		position: static;
		padding-left: 0;
		line-height: 1.5;
		color: var(--automataColor);
	}

	.latest-panel a::after {
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

	.latest-panel p {
		margin-top: 0.4rem;
		color: var(--text-2);
	}

	.latest-panel small {
		display: block;
		margin-top: 0.3rem;
		color: var(--automataColor);
	}

	.latest-panel li:hover p,
	.latest-panel li:hover a,
	.latest-panel li:hover small,
	.latest-panel li:focus-within p,
	.latest-panel li:focus-within a,
	.latest-panel li:focus-within small {
		color: inherit;
	}

	@media (min-width: 1000px) {
		.latest-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1400px) {
		.separator {
			flex-direction: row;
		}
		.section-1 {
			flex: 1 1 20em;
			width: 100%;
		}
		.section-2 {
			flex: 1 1 50em;
		}
	}
</style>
