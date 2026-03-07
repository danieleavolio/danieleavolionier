<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let data;
	export let form;

	let isAuthenticated = data?.authenticated ?? false;
	let password = '';
	let errorMessage = '';

	type EditablePost = {
		slug: string;
		title: string;
		description: string;
		categories: string[];
		content: string;
	};

	let selectedPost: EditablePost = {
		slug: '',
		title: '',
		description: '',
		categories: [],
		content: ''
	};

	onMount(() => {
		if (!isAuthenticated && document.cookie.includes('admin_auth=password')) {
			isAuthenticated = true;
		}
	});

	function checkPassword() {
		if (password === 'password') {
			document.cookie = 'admin_auth=password; path=/; max-age=2592000; SameSite=Lax';
			isAuthenticated = true;
		} else {
			errorMessage = 'Password non valida';
			setTimeout(() => {
				errorMessage = '';
			}, 3000);
		}
	}

	function logout() {
		document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		isAuthenticated = false;
		password = '';
	}

	function editPost(post: EditablePost) {
		selectedPost = post;
	}

	function newPost() {
		selectedPost = {
			slug: '',
			title: '',
			description: '',
			categories: [],
			content: ''
		};
	}

	const getMarked = () => (browser ? (window as any).marked : null);
	$: preview = getMarked() ? getMarked().parse(selectedPost.content) : '';
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
</svelte:head>

<div class="admin-container">
	{#if !isAuthenticated}
		<div class="login-container">
			<h1>Accesso Amministratore</h1>
			<form on:submit|preventDefault={checkPassword}>
				<label for="password">Password</label>
				<input type="password" id="password" bind:value={password} required />
				<button type="submit">Entra</button>
			</form>
			{#if errorMessage}
				<div class="toast" transition:fade>{errorMessage}</div>
			{/if}
		</div>
	{:else}
		<div class="post-list">
			<h2>Posts</h2>
			<button on:click={newPost}>Nuovo Post</button>
			<button on:click={logout} class="logout-button">Logout</button>
			<ul>
				{#each data.posts as post}
					<li>
						<button type="button" class="item-button" on:click={() => editPost(post)}>
							{post.title}
						</button>
						<form
							method="POST"
							action="?/remove"
							use:enhance
							on:submit={(event) => {
								if (!confirm(`Eliminare il post \"${post.title}\"?`)) event.preventDefault();
							}}
						>
							<input type="hidden" name="slug" value={post.slug} />
							<button type="submit" class="delete-button">Elimina</button>
						</form>
					</li>
				{/each}
			</ul>
		</div>

		<div class="editor-grid">
			<form method="POST" use:enhance>
				<h1>{selectedPost.slug ? 'Modifica Post' : 'Nuovo Post'}</h1>
				<input type="hidden" name="slug" value={selectedPost.slug} />

				<label for="title">Titolo</label>
				<input type="text" id="title" name="title" bind:value={selectedPost.title} required />

				<label for="description">Descrizione</label>
				<textarea id="description" name="description" bind:value={selectedPost.description} required
				></textarea>

				<label for="categories">Categorie (separate da virgola)</label>
				<input
					type="text"
					id="categories"
					name="categories"
					bind:value={selectedPost.categories}
					required
				/>

				<label for="content">Contenuto (Markdown)</label>
				<textarea id="content" name="content" rows="20" bind:value={selectedPost.content} required
				></textarea>

				<button type="submit">Salva Post</button>
			</form>

			<div class="preview-container prose">
				<h2>Anteprima</h2>
				{@html preview}
			</div>
		</div>

		{#if form?.message}
			<p class="response-message" transition:fade>{form.message}</p>
		{/if}
	{/if}
</div>

<style>
	.admin-container {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 1rem;
		padding: 1rem;
	}

	.login-container {
		grid-column: 1 / -1;
		text-align: center;
	}

	.post-list {
		border-right: 1px solid var(--automataColor);
		padding-right: 1rem;
	}

	.post-list ul {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
	}

	.post-list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
	}

	.item-button {
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		padding: 0;
		flex: 1;
	}

	.post-list li:hover {
		background-color: var(--automataBgRGBA);
	}

	.editor-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
		text-transform: uppercase;
		font-size: 0.9rem;
	}

	input,
	textarea {
		padding: 0.5rem;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		background-color: var(--automataBg);
		color: var(--automataColor);
		font-family: var(--font-mono);
	}

	textarea {
		resize: vertical;
	}

	button {
		text-transform: uppercase;
		font-weight: 300;
		letter-spacing: 0.3rem;
		text-shadow: 0.2rem 0.2rem 0 rgba(77, 73, 62, 0.3);
		cursor: pointer;
		font: inherit;
		border: none;
		padding: 0.4rem 1rem;
		background-color: var(--automataBgRGBA);
		color: var(--automataColor);
		box-sizing: content-box;
		position: relative;
		border: 1px solid transparent;
		border-left: none;
		border-right: none;
		transition: all 0.1s ease-in-out;
		text-align: center;
		margin-top: 1rem;
	}

	.delete-button,
	.logout-button {
		letter-spacing: 0.12rem;
		padding: 0.2rem 0.6rem;
		margin-top: 0;
	}

	button:hover,
	button:focus {
		background-color: var(--automataColor);
		color: var(--automataBg) !important;
		border-color: var(--automataColor);
		text-decoration: none;
	}

	.response-message {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 4px;
		background-color: #f0f0f0;
	}

	.toast {
		position: fixed;
		top: 20px;
		right: 20px;
		background-color: var(--automataRed);
		color: var(--automataWhite);
		padding: 1rem;
		border-radius: 5px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.preview-container {
		padding: 1rem;
		border: 1px solid var(--automataColor);
		background-color: var(--automataBg);
	}
</style>
