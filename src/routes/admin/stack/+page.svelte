<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';

	export let data;
	export let form;

	let isAuthenticated = false;
	let password = '';
	let errorMessage = '';

	let stackElements = data.stackElements;
	let stackElementContents = data.stackElementContents;

	let selectedElement = stackElements[0];

	const uniqueColors = [...new Set(stackElements.map(el => el.color))];

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
		<div class="stack-list">
			<h2>Stack Elements</h2>
			<ul>
				{#each stackElements as element}
					<li>
						<span on:click="{() => (selectedElement = element)}">{element.title}</span>
						<select bind:value="{element.color}">
							{#each uniqueColors as color}
								<option value="{color}">{color}</option>
							{/each}
						</select>
					</li>
				{/each}
			</ul>
		</div>

		<div class="editor-grid">
			<form method="POST" use:enhance>
				<h1>Modifica Stack</h1>
				<input type="hidden" name="password" value="{password}" />
				<input type="hidden" name="stackElements" value="{JSON.stringify(stackElements)}" />
				<input
					type="hidden"
					name="stackElementContents"
					value="{JSON.stringify(stackElementContents)}"
				/>

				<label for="content">Contenuto (Markdown)</label>
				<textarea id="content" rows="20" bind:value="{stackElementContents[selectedElement.slug]}"></textarea>

				<button type="submit">Salva Stack</button>
			</form>
		</div>

		{#if form?.message}
			<p class="response-message" transition:fade>{form.message}</p>
		{/if}
	{/if}
</div>