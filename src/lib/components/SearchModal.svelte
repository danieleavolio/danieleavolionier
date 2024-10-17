<script lang="ts">
	import { createIndex, searchPostsIndex } from '$lib/search';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import { goto } from '$app/navigation';

	let search: 'loading' | 'ready' = 'loading';
	let searchTerm = '';
	let results: any[] = [];
	let showModal = false;
	let dialog: HTMLDialogElement;

	onMount(async () => {
		// get the posts
		const posts = await fetch('/search.json').then((res) => res.json());
		// create search index
		createIndex(posts);
		// we're in business 🤝
		search = 'ready';
	});

	$: if (search === 'ready') {
		// runs each time `searchTerm` updates
		results = searchPostsIndex(searchTerm);
	}
</script>

<div class="search-icon">
	<button on:click={() => (showModal = !showModal)}>
		<span class="material-symbols-outlined"> search </span>
	</button>
</div>


<Modal bind:dialog={dialog} bind:showModal isSearch={true}>
	{#if search === 'ready'}
		<div class="search">
			<input
				bind:value={searchTerm}
				placeholder="Cerca..."
				autocomplete="off"
				spellcheck="false"
				type="search"
			/>

			<div class="results">
				{#if results}
					<ul>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						{#each results as result (result.slug)}
							<div
								on:click={() => {
									goto("/" + result.slug);
									showModal = false;
									searchTerm = '';
									dialog.close();
								}}
								class="link"
								transition:fade={{
									duration: 20
								}}
							>
								<h3>
									{@html result.title}
								</h3>
								<p>{@html result.content}</p>
							</div>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}
</Modal>

<style>
	.search {
		padding: 1em;
	}

	.search-icon{
		transform: translateY(0);
	}

	@media (min-width: 1300px) {
		.search-icon{
			transform: translateY(-10px);
		}
	}

	button {
		background-color: var(--automataBlackO);
		color: var(--automataWhite);
		border: none;
		padding: 0.5em;
		cursor: pointer;
		border-radius: 100%;
	}

	input {
		width: 100%;
		padding: 0.5em;
		font-size: 1em;
		background-color: var(--automataBlackO);
		color: var(--automataWhite);
	}

	h3 {
		margin: 0;
		color: var(--automataWhite);
	}

	/* input placeholder */
	::placeholder {
		color: var(--automataWhite);
	}

	.results {
		margin-top: 1em;
	}

	.results ul {
		list-style: none;
		padding: 0;
	}

	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.link {
		cursor: pointer;
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		padding: 1em;
		transition: background-color 0.3s;
	}

	.link:hover {
		background-color: var(--automataBlackO);
	}

	.results p {
		margin-top: 0.5em;
	}
</style>
