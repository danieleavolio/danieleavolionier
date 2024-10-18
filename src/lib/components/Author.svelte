<script lang="ts">
	export let name = 'Name';
	export let surname = 'Surname';
	export let username = 'Username';
	export let description = 'Description';
    
	import Contacts from './Contacts.svelte';
</script>

<div class="author">
	<div class="name-surname">
		<span>{name}</span>
		<span class="username">{username}</span>
		<span>{surname}</span>
	</div>
	<p>{description}</p>
	<Contacts />
</div>

<style>
	.author {
		display: flex;
		flex-direction: column;
		color: var(--automataBlackO);
		font-size: 1.2em;
		background-color: var(--automataYellow);
		margin: auto;
		padding: 1em;
		border-radius: 0.2em;
	}
	.name-surname {
		display: flex;
		align-items: center;
	}
	.username {
		font-weight: bold;
		margin: 0 0.5rem;
	}
</style>
