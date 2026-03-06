<script lang="ts">
	import * as config from '$lib/config';
	import { Square } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { FaqItem } from '$lib/types';
	import Profile from './profile.svelte';
	import { goto } from '$app/navigation';
	import Seo from '$lib/components/SEO.svelte';
	import { formatDate } from '$lib/utils';

	export let data: PageData;

	let items_container: HTMLElement;
	let totalPassword = '';

	const faqItems: FaqItem[] = [
		{
			question: 'Che contenuti trovo su danieleavolio.it?',
			answer:
				'Trovi articoli tecnici su sviluppo web e AI, una raccolta di progetti personali e appunti universitari gratuiti.'
		},
		{
			question: 'Con quale frequenza vengono pubblicati nuovi contenuti?',
			answer:
				'I contenuti vengono aggiornati in base ai nuovi progetti e alle nuove esperienze professionali.'
		}
	];

	$: latestPosts = data.posts.slice(0, 3);
	$: latestProjects = data.progetti.slice(0, 3);

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
				goto('/end-of-the-lova');
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
</script>

<Seo
	title={config.title}
	description="Sono Daniele Avolio, uno studente di Informatica presso l'Università della Calabria. Qui puoi trovare i miei progetti, i miei appunti e le mie esperienze lavorative."
	image="https://i.imgur.com/juSgfgF.png"
	{faqItems}
/>

<div class="separator">
	<section class="section-1">
		<li class="post">
			<div bind:this={items_container} class="items-container">
				<a href="/pagine" class="title"><Square /> Blog</a>
				<a href="/progetti" class="title"><Square /> Progetti</a>
				<a href="/data" class="title"><Square /> Data</a>
				<a href="/appunti" class="title"><Square /> Appunti</a>
			</div>
		</li>
	</section>
	<section class="section-2"><Profile /></section>
</div>

<section class="latest-grid">
	<article class="latest-panel">
		<h2>Ultimi articoli</h2>
		<ul>
			{#each latestPosts as post}
				<li>
					<a href={`/pagine/${post.slug}`}>{post.title}</a>
					<p>{formatDate(post.date)}</p>
				</li>
			{/each}
		</ul>
	</article>

	<article class="latest-panel">
		<h2>Ultimi progetti</h2>
		<ul>
			{#each latestProjects as project}
				<li>
					<a href={`/progetti/${project.slug}`}>{project.title}</a>
					<p>{formatDate(project.date)}</p>
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
		padding-top: 0;
		padding-bottom: 0;
		width: 100%;
	}

	.separator {
		display: flex;
		flex-direction: column-reverse;
		justify-content: space-around;
		align-items: center;
		gap: 4rem;
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
		text-transform: capitalize;
	}

	.latest-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.latest-panel {
		background-color: var(--automataBgOpacity);
		padding: 1rem;
		border-top: 1px solid var(--automataBlackOpacity);
		border-bottom: 1px solid var(--automataBlackOpacity);
	}

	.latest-panel h2 {
		margin-bottom: 1rem;
	}

	.latest-panel ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.latest-panel li {
		display: block !important;
		padding-left: 0;
		background-image: none;
		margin-bottom: 0;
	}

	.latest-panel a {
		padding-left: 0;
	}

	.latest-panel p {
		margin-top: 0.4rem;
		color: var(--text-2);
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
