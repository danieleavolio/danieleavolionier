<!-- Component dove ci sono linkedin twitter e github -->
<script lang="ts">
	let contacts = [
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/danieleavolio/',
			icon: 'lerna'
		},
		{
			name: 'x',
			url: 'https://twitter.com/avolio_daniele',
			icon: 'x'
		},
		{
			name: 'GitHub',
			url: 'https://github.com/danieleavolio',
			icon: 'github'
		}
	];

	const handleClick = (url: string) => {
		window.open(url, '_blank');
	};
</script>

<div class="contacts">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#each contacts as contact}
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<img
			src={`https://simpleicons.org/icons/${contact.icon}.svg`}
			alt={contact.name}
			class="icon"
			on:click={() => handleClick(contact.url)}
		/>
	{/each}
</div>

<style>
	.icon {
		transition: all 0.2s ease;
		width: 3em;
		height: 3em;
	}

	.icon:hover {
		cursor: pointer;
		transform: scale(1.1);
		border-radius: 100%;
	}

	.contacts {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
