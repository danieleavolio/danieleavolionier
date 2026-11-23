<script lang="ts">
	import Footer from './footer.svelte';
	import Header from './header.svelte';

	import 'open-props/buttons';
	import 'open-props/normalize';
	// Same tokens as the full stylesheet, without unused gradient/palette catalogs.
	import 'open-props/fonts';
	import 'open-props/sizes';
	import 'open-props/easings';
	import 'open-props/zindex';
	import 'open-props/shadows';
	import 'open-props/aspects';
	import 'open-props/colors';
	import 'open-props/animations';
	import 'open-props/borders';

	import '../app.css';

	import PageTransition from './transition.svelte';

	import isOpened from '#lib/stores/navstore.ts';

	import { dev } from '$app/env';
	import { injectAnalytics } from '#lib/analytics.ts';

	export let data;

	import { onMount } from 'svelte';

	//If the window is not defined, we are in SSR
	const document = typeof window !== 'undefined' ? window.document : null;

	$: if (isOpened) {
		if (document != null) document.body.style.overflow = $isOpened ? 'hidden' : 'auto';
	}

	let globalSecretSequence = '';
	onMount(() => {
		// The Vercel analytics endpoint does not exist in local production previews.
		if (!dev && !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
			injectAnalytics();
		}
		const handleGlobalKeydown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			// Ignora se l'utente sta digitando in un input o textarea
			if (
				target &&
				(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
			) {
				return;
			}

			if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
				e.preventDefault();
				window.location.href = '/admin';
				return;
			}

			globalSecretSequence += e.key.toLowerCase();
			if (globalSecretSequence.length > 25) {
				globalSecretSequence = globalSecretSequence.slice(-25);
			}

			if (globalSecretSequence.includes('logins')) {
				globalSecretSequence = '';
				window.location.href = '/admin';
			}
		};

		window.addEventListener('keydown', handleGlobalKeydown);
		return () => {
			window.removeEventListener('keydown', handleGlobalKeydown);
		};
	});
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

	/* The editor toolbar, rather than the site navigation, sticks in the writing view. */
	.layout:has(:global(.zen-frame)) > :global(nav) {
		position: static;
	}

	/* Keep Zen in the same DOM so the editor and its unsaved state stay mounted. */
	.layout:has(:global(.zen-frame.active)) {
		visibility: hidden;
	}

	:global(html:has(.zen-frame.active)) {
		overflow: hidden;
	}

	@media (min-width: 1440px) {
		.layout {
			padding-inline: 0;
		}
	}
</style>
