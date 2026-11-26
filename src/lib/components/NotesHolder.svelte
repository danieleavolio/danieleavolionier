<script lang="ts">
	let {
		title = '',
		description = '',
		category = '',
		downloadLink = '',
		isPdf = false
	}: {
		title?: string;
		description?: string;
		category?: string;
		downloadLink?: string;
		isPdf?: boolean;
	} = $props();
</script>

<div class="note-holder">
	<div class="title-desc">
		<p class="meta">
			<span class="badge">{isPdf ? 'PDF' : 'Link'}</span>
			{#if category}<span class="badge">{category}</span>{/if}
		</p>
		<p class="note-title">{title}</p>

		<div class="note-description">
			<p>{description}</p>
		</div>
	</div>
	<a href={downloadLink} target="_blank" rel="noopener" aria-label={`Apri ${title}`}>
		<span class="material-symbols-outlined"> download </span>
	</a>
</div>

<style>
	.note-title {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 0.5rem;
	}

	.badge {
		padding: 0.1rem 0.5rem;
		border: 1px solid currentColor;
		font-size: 0.75rem;
		letter-spacing: 0.08rem;
		text-transform: uppercase;
	}

	.note-holder {
		box-sizing: border-box;
		min-width: 0;
		overflow-wrap: anywhere;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		width: fit-content;
		padding: 1rem;
		transition: all 0.1s ease-in-out;
		box-shadow: 0px 7px 0px 1px rgba(0, 0, 0, 0.5);
		width: 100%;
		justify-content: space-between;
	}

	.note-holder:hover {
		background-color: var(--automataWhite);
		color: var(--automataBlackO);
		box-shadow: 0 0 0 0;
		transform: scale(1.05);
	}

	a {
		color: inherit;
		text-decoration: none;
		height: fit-content;
		z-index: 999;
	}
</style>
