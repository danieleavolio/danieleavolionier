<script lang="ts">
	export let html = '';
</script>

<div class="rich-content prose">
	{@html html}
</div>

<style>
	.rich-content :global(img),
	.rich-content :global(video),
	.rich-content :global(iframe) {
		max-width: 100%;
		margin: 1rem auto;
		display: block;
	}

	.rich-content :global(iframe) {
		width: 100%;
		min-height: 20rem;
		border: 0;
	}

	.rich-content :global(.rich-gallery) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
	}

	.rich-content :global(.rich-gallery img) {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.rich-content :global(.rich-grading) {
		padding: 1rem;
		border: 1px solid var(--automataColor);
		text-align: center;
		font-weight: 700;
	}
</style>
