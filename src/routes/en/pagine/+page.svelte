<script lang="ts">
	// Stessa lista dell'italiano, con gli articoli tradotti.
	import Page from '../../pagine/+page.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page {data} />
