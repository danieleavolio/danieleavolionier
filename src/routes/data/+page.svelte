<script lang="ts">
	import Modal from '#lib/components/Modal.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import type { ComponentType } from 'svelte';
	import type { stackElement } from '#lib/types.ts';
	import stackElements from '#lib/stackElements.json';

	let showModal = false;

	let selectedItem = 'None';
	let selectedModalContent: { default: ComponentType } | undefined;

	const handleModalClick = async (e: stackElement) => {
		const content = await import(`../../stackElements/${e.slug}.md`);
		selectedModalContent = content;
		selectedItem = e.title;

		showModal = true;
	};
</script>

<Seo
	title="Dati di Sistema, Competenze & Esperienze"
	description="Panoramica su competenze tecniche, stack tecnologico ed esperienze lavorative di Daniele Avolio, sviluppatore web e AI specialist."
/>
<h1 class="sr-only">Competenze ed esperienze di Daniele Avolio</h1>
<div class="data">
	<Modal bind:showModal>
		<p class="title" slot="header">
			{selectedItem}
		</p>
		{#if selectedModalContent}
			<div class="prose">
				<svelte:component this={selectedModalContent.default} class="insider" />
			</div>
		{/if}
	</Modal>
	<p class="title">Daniele Avolio: DATI</p>
	<div class="stack">
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		{#each stackElements as element (element.slug)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<p class="stack-element stack-{element.color}" on:click={() => handleModalClick(element)}>
				{element.title}
			</p>
		{/each}
	</div>
</div>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		border-radius: 0;
	}

	.data {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.title {
		text-align: center;
		font-size: var(--font-size-fluid-2);
	}

	/* Original light-theme swatches, frozen so dark mode keeps the same colours. */
	.stack {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		width: 100%;
		max-width: 230px;
		margin: auto;
		border: 2px solid var(--automataColor);
		padding: 0.3em;
		padding-bottom: 0.5em;
	}

	.stack-element {
		text-align: center;
		padding: 1em;
		box-shadow: 0 5px 0 var(--automataColor);
		cursor: pointer;
		transition: all 0.1s ease-in;
	}

	.stack-yellow {
		background-color: #d6ceaa;
		color: #4d493e;
	}

	.stack-red {
		background-color: #cb9279;
		color: #4d493e;
	}

	.stack-white {
		background-color: #dad5c0;
		color: #4d493e;
	}

	.stack-black {
		background-color: #716d5e;
		color: #e8e2cf;
	}

	.stack-element:hover {
		transform: translateY(-5px);
	}

	.stack-yellow:hover {
		background-color: #e1d8aa;
	}

	.stack-red:hover {
		background-color: #cd674d;
	}

	.stack-white:hover {
		background-color: #ece7d5;
	}

	.stack-black:hover {
		background-color: #4d493e;
		color: #e8e2cf;
	}
</style>
