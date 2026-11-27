<script lang="ts">
	// Stessa pagina dell'italiano: cambia solo la lingua dei dati e dei testi fissi.
	import Page from '../../../pagine/[slug]/+page.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Page {data} />
