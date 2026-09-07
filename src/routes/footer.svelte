<script lang="ts">
	import * as config from '$lib/config';
</script>

<footer>
	<p>{config.title} &copy {new Date().getFullYear()}</p>
	<a href="/privacy-policy">Privacy Policy di Astra</a>
</footer>

<style>
	footer {
		padding-block: var(--size-7);
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-4);
		flex-wrap: wrap;
	}

	p {
		color: var(--text-2);
	}

	a {
		font-size: 0.85rem;
		text-transform: none;
		letter-spacing: normal;
		padding: 0;
		background: transparent;
	}
</style>
