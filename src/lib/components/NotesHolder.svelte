<script>
	import { Square } from 'lucide-svelte';

	export let title = '';
	export let description = '';
	export let downloadLink = '';

	// console.log(title);
	// console.log(description);
	// console.log(downloadLink);

	const download = () => {
		console.log('Download');
	};
</script>

<div class="note-holder">
	<p class="note-title">{title}</p>

	<div class="note-description">
		<p>{description}</p>
	</div>
	<a href={downloadLink} target="_blank">
		<span class="material-symbols-outlined"> download </span>
	</a>
</div>

<style>
	.note-title {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.note-holder {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		width: fit-content;
		padding: 1rem;
		transition: all 0.1s ease-in-out;
		box-shadow: 0px 7px 0px 1px rgba(0, 0, 0, 0.5);
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
