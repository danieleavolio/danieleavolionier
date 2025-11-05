<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
</svelte:head>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	export let form;
	let isAuthenticated = false;
	let password = '';
	let errorMessage = '';
	let content = '';

	function checkPassword() {
		if (password === 'password') {
			isAuthenticated = true;
		} else {
			errorMessage = 'Password non valida';
			setTimeout(() => {
				errorMessage = '';
			}, 3000);
		}
	}

	$: preview = browser && window.marked && window.marked.parse(content);
</script>

<div class="editor-container">
	{#if !isAuthenticated}
		<div class="login-container">
			<h1>Accesso Amministratore</h1>
			<form on:submit|preventDefault="{checkPassword}">
				<label for="password">Password</label>
				<input type="password" id="password" bind:value="{password}" required />
				<button type="submit">Entra</button>
			</form>
			{#if errorMessage}
				<div class="toast" transition:fade>{errorMessage}</div>
			{/if}
		</div>
	{:else}
		<div class="editor-grid">
			<div>
				<h1>Nuovo Post</h1>
				<form method="POST" use:enhance>
					<input type="hidden" name="password" value="{password}" />

					<label for="title">Titolo</label>
					<input type="text" id="title" name="title" required />

					<label for="description">Descrizione</label>
					<textarea id="description" name="description" required></textarea>

					<label for="categories">Categorie (separate da virgola)</label>
					<input type="text" id="categories" name="categories" required />

					<label for="content">Contenuto (Markdown)</label>
					<textarea id="content" name="content" rows="20" bind:value="{content}" required></textarea>

					<button type="submit">Salva Post</button>
				</form>
			</div>
			<div>
				<h1>Nuovo Elemento Stack</h1>
				<form method="POST" action="?/createStackElement" use:enhance>
					<input type="hidden" name="password" value="{password}" />

					<label for="stackTitle">Titolo</label>
					<input type="text" id="stackTitle" name="stackTitle" required />

					<label for="stackColor">Colore</label>
					<input type="text" id="stackColor" name="stackColor" required />

					<button type="submit">Salva Elemento</button>
				</form>
			</div>
		</div>

		<div class="preview-container prose">
			<h2>Anteprima</h2>
			{@html preview}
		</div>

		{#if form?.message}
			<p class="response-message" transition:fade>{form.message}</p>
		{/if}
	{/if}
</div>

<style>
	.editor-container {
		margin: 0 auto;
		padding: 2rem;
	}

	.login-container {
		text-align: center;
	}

	.editor-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		font-weight: bold;
		text-transform: uppercase;
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
