<script lang="ts">
	import * as config from '$lib/config';
	import { Square } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Profile from './profile.svelte';
	import { goto } from '$app/navigation';
	import Seo from '$lib/components/SEO.svelte';

	let items_container: HTMLElement;
	let totalPassword = '';
	onMount(() => {
		items_container.addEventListener('mousemove', (e) => {
			let rect = items_container.getBoundingClientRect();
			const left = e.clientX - rect.left;
			const top = e.clientY - rect.top;
			items_container.style.setProperty('--left', `${left}px`);
			items_container.style.setProperty('--top', `${top}px`);
		});

		window.addEventListener('keydown', (e) => {
			totalPassword += e.key;

			if (totalPassword.includes('endofthelova')) {
				goto('/end-of-the-lova');
			}

			// If 0 is pressed reset the password
			if (e.key === '0') {
				totalPassword = '';
			}
		});
	});
</script>


<Seo
	title={config.title}
	description="Sono Daniele Avolio, uno studente di Informatica presso l'Università della Calabria. Qui puoi trovare i miei progetti, i miei appunti e le mie esperienze lavorative.
	Ma chissà, forse c'è qualcosa di nascosto e segreto..."
	image="https://i.imgur.com/juSgfgF.png"
/>


<div class="separator">
	<section class="section-1">
		<li class="post">
			<div bind:this={items_container} class="items-container">
				<a href="data" class="title"><Square /> Data</a>
				<a href="progetti" class="title"><Square /> Progetti</a>
				<a href="pagine" class="title"><Square /> Blog</a>
				<a href="appunti" class="title"><Square /> Appunti</a>
			</div>
		</li>
	</section>
	<section class="section-2"><Profile /></section>
</div>

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
		flex-direction: column;
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
