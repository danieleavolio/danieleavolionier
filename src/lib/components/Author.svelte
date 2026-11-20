<script lang="ts">
	export let name = 'Name';
	export let surname = 'Surname';
	export let username = 'Username';
	export let description = 'Description';

	import Contacts from './Contacts.svelte';
</script>

<section class="author yr-panel" aria-label="Informazioni sull'autore">
	<h2 class="yr-panel__head"><span class="yr-panel__square" aria-hidden="true"></span>Autore</h2>
	<div class="author-body">
		<div class="name-surname">
			<span>{name}</span>
			<span class="username">{username}</span>
			<span>{surname}</span>
		</div>
		<p>{description}</p>
		<Contacts />
	</div>
</section>

<style>
	.author {
		margin-block: 1.5rem;
		color: var(--automataColor);
	}
	.author-body {
		display: grid;
		gap: 0.9rem;
		padding: 1.2rem;
	}
	p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.7;
	}
	.name-surname {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		font-size: 1.1rem;
	}
	.username {
		font-weight: 500;
		font-size: 0.8rem;
		padding: 0.1rem 0.4rem;
		border: 1px solid var(--yr-line);
	}
</style>
