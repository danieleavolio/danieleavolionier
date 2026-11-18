<script lang="ts">
	const contacts = [
		{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/danieleavolio/' },
		{ name: 'X', url: 'https://twitter.com/avolio_daniele' },
		{ name: 'GitHub', url: 'https://github.com/danieleavolio' }
	];
</script>

<nav class="contacts" aria-label="Profili dell'autore">
	{#each contacts as contact (contact.url)}
		<a href={contact.url} target="_blank" rel="noopener noreferrer">
			<span aria-hidden="true"></span>{contact.name}
		</a>
	{/each}
</nav>

<style>
	.contacts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 2.75rem;
		box-sizing: border-box;
		padding: 0.6rem 0.85rem;
		background: var(--yr-muted);
		border: 1px solid var(--yr-line);
		color: var(--automataColor);
		font-size: 0.75rem;
		line-height: 1.5;
		letter-spacing: 0.1rem;
		text-transform: uppercase;
		text-decoration: none;
		text-shadow: none;
	}
	a::before,
	a::after {
		display: none;
	}
	a:hover,
	a:focus-visible {
		background: var(--automataColor);
		color: var(--automataBg);
		border-color: var(--automataColor);
	}
	span {
		flex: 0 0 0.6rem;
		height: 0.6rem;
		background: currentColor;
	}
</style>
