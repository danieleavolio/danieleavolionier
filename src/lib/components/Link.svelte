<script lang="ts">
	export let href = '';
	export let target: '_self' | '_blank' = '_blank';
	export let rel = 'noopener noreferrer';
</script>

<a class="link-normale" {href} {target} {rel}>
	<slot></slot>
</a>

<style>
	.link-normale {
		display: inline;
		margin: 0;
		padding: 0.2em;
		cursor: pointer;
		color: var(--text-1-dark);
		text-decoration: none;
		transition:
			color 0.15s ease,
			border-color 0.15s ease;
		width: fit-content;
		transition: all 0.5s ease;
	}

	.link-normale:hover {
		background-color: var(--automataBgRGBA);
	}
</style>
