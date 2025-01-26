<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Seo from '$lib/components/SEO.svelte';
	import * as config from '$lib/config';
	import stackElements, { type stackElement } from '$lib/stackElements';
	let showModal = false;

	let selectedItem = 'None';
	let selectedModalContent: any;

	const handleModalClick = async (e: stackElement) => {
		const content = await import(`../../stackElements/${e.slug}.md`);
		selectedModalContent = content;
		selectedItem = e.title;

		showModal = true;
	};
</script>



<Seo
	title={config.title}
	description="La pagina che contiene dati personali ed esperienze lavorative. Qui puoi trovare i dati personali e le esperienze lavorative di Daniele Avolio."
	image="https://i.imgur.com/juSgfgF.png"
/>
<div class="data">
	<Modal bind:showModal>
		<p class="title" slot="header">
			{selectedItem}
		</p>
		{#if selectedModalContent}
			<div class="prose">
				<svelte:component class="insider" this={selectedModalContent.default} />
			</div>
		{/if}
	</Modal>
	<p class="title">Daniele Avolio: DATI</p>
	<div class="stack">
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		{#each stackElements as element}
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
		border-radius: 2px;
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
		box-shadow: 0 5px 0px var(--automataColor);
		cursor: pointer;
		transition: all 0.1s ease-in;
	}

	.stack-yellow {
		background-color: var(--automataYellowOpacity);
	}

	.stack-red {
		background-color: var(--automataRedOpacity);
	}

	.stack-white {
		background-color: var(--automataWhiteOpacity);
	}

	.stack-black{
		background-color: var(--automataBlackOpacity);
		color: var(--automataBg);
	}

	.stack-element:hover {
		transform: translateY(-5px);
	}

	.stack-yellow:hover {
		background-color: var(--automataYellow);
	}

	.stack-red:hover {
		background-color: var(--automataRed);
	}

	.stack-white:hover {
		background-color: var(--automataWhite);
	}

	.stack-black:hover{
		background-color: var(--automataColor);
		color: var(--automataBg);
	}

</style>
