<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | Daniele Avolio</title>
	<meta name="robots" content="noindex,follow" />
</svelte:head>

<div class="error"><h1>{page.status}: {page.error?.message}</h1></div>

<style>
	.error {
		height: 100%;
		display: grid;
		place-content: center;
	}
</style>
