<script lang="ts">
	export let form;
</script>

<svelte:head><title>Admin login | Daniele Avolio</title></svelte:head>

<section class="login-card">
	<p class="eyebrow">DANIELE AVOLIO · ADMIN</p>
	<h1>Accedi</h1>
	<form method="POST">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" autocomplete="email" required />
		<label for="password">Password</label>
		<input id="password" name="password" type="password" autocomplete="current-password" required />
		<button type="submit">Entra</button>
	</form>
	{#if form?.message}<p class="error">{form.message}</p>{/if}
</section>

<style>
	.login-card {
		padding: 2rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBgOpacity);
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.12rem;
		opacity: 0.7;
	}

	form {
		display: grid;
		gap: 0.5rem;
	}

	label {
		margin-top: 0.75rem;
		font-weight: 700;
	}

	input {
		padding: 0.7rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		color: var(--automataColor);
	}

	button {
		margin-top: 1rem;
	}

	.error {
		color: var(--automataRed);
	}
</style>
