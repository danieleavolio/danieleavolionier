<script lang="ts">
	import Footer from './footer.svelte';
	import Header from './header.svelte';

	import 'open-props/style';
	import 'open-props/normalize';
	import 'open-props/buttons';

	import '../app.css';

	import PageTransition from './transition.svelte';

	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';

	inject({ mode: dev ? 'development' : 'production' });
	export let data;
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
