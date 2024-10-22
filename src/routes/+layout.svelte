<script lang="ts">
	import Footer from './footer.svelte';
	import Header from './header.svelte';

	import 'open-props/buttons';
	import 'open-props/normalize';
	import 'open-props/style';

	import '../app.css';

	import PageTransition from './transition.svelte';

	import isOpened from '$lib/stores/navstore';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	export let data;
	inject({ mode: dev ? 'development' : 'production' });

	//If the window is not defined, we are in SSR
	const document = typeof window !== 'undefined' ? window.document : null;

	$: if (isOpened) {
		if (document != null) document.body.style.overflow = $isOpened ? 'hidden' : 'auto';
	}
</script>

<div class="layout">
	<Header />

	<main>
		<PageTransition url={data.url}>
			<slot />
		</PageTransition>
	</main>

	<Footer />
</div>

<style>
	.layout {
		height: 100%;
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr auto;
		margin-inline: auto;
		padding-inline: var(--size-7);
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 100vh;
	}

	main {
		padding-block: var(--size-9);
	}

	@media (min-width: 1440px) {
		.layout {
			padding-inline: 0;
		}
	}
</style>
