<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import stackElements, { type stackElement } from '$lib/stackElements';
	let showModal = false;
	import * as config from '$lib/config';

	let selectedItem = 'None';
	let selectedModalContent: any;

	const handleModalClick = async (e: stackElement) => {
		const content = await import(`../../stackElements/${e.slug}.md`);
		selectedModalContent = content;
		selectedItem = e.title;

		showModal = true;
	};
</script>

<svelte:head>
	<title>{config.title} Data</title>
</svelte:head>

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
	<p class="title">Daniele Avolio's Data</p>
	<div class="stack">
		{#each stackElements as element}
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
		height: 50vh;
		width: 100%;
		max-width: 230px;
		margin: auto;
		border: 2px solid var(--automataColor);
		padding: 0.3em;
	}

	.stack-element {
		text-align: center;
		padding: 1em;
		box-shadow: 0 5px 0px var(--automataColor);
		cursor: pointer;
		transition: all 0.1s ease-in-out;
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
