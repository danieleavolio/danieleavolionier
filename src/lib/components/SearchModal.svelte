<script lang="ts">
	import { onMount } from 'svelte';
	import { createPostsIndex, searchPostsIndex } from '$lib/search';
	import Modal from './Modal.svelte';
	import { fade } from 'svelte/transition';

	let search: 'loading' | 'ready' = 'loading';
	let searchTerm = '';
	let results: any[] = [];
	let showModal = false;

	onMount(async () => {
		// get the posts
		const posts = await fetch('/search.json').then((res) => res.json());
		// create search index
		createPostsIndex(posts);
		// we're in business 🤝
		search = 'ready';
	});

	$: if (search === 'ready') {
		// runs each time `searchTerm` updates
		results = searchPostsIndex(searchTerm);
	}
</script>

<!-- search icon -->

<div class="search-icon">
	<button on:click={() => (showModal = !showModal)}>
		<span class="material-symbols-outlined"> search </span>
	</button>
</div>

<Modal showModal={showModal}>
	{#if search === 'ready'}
		<div class="search">
			<input
				bind:value={searchTerm}
				placeholder="Search"
				autocomplete="off"
				spellcheck="false"
				type="search"
			/>

			<div class="results">
				{#if results}
					<ul>
						{#each results as result (result.slug)}
							<li transition:fade>
								<a href="/{result.slug}">
									{@html result.title}
								</a>
								<p>{@html result.content}</p>
							</li>
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

    .search-icon {
        position: absolute;
        bottom: 3em;
        right: 0;
    }

    button{
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

	.results li {
		margin-top: 1em;
	}

	.results a {
		text-decoration: none;
	}

	.results p {
		margin-top: 0.5em;
	}
</style>
