<script lang="ts">
	import * as config from '$lib/config';
	import { onMount } from 'svelte';
	let render = false;

	onMount(() => {
		setTimeout(() => {
			render = true;
		}, 2000);
	});
</script>

<svelte:head>
	<title>{config.title} Projects</title>
</svelte:head>

<section>
	<h2>PAGE UNDER CONSTRUCTION</h2>
</section>

<style>
	h2 {
		text-align: center;
		font-size: var(--font-size-fluid-3) !important;
	}
</style>
