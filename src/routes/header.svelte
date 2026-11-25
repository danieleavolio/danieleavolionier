<script lang="ts">
	import * as config from '#lib/config.ts';
	import { page } from '$app/state';
	import Icon from '#lib/components/ui/Icon.svelte';
	import ThemeToggle from '#lib/components/ui/ThemeToggle.svelte';

	//Import store and set to true on click
	import isOpened from '#lib/stores/navstore.ts';
	import SearchModal from '#lib/components/SearchModal.svelte';

	let menu: HTMLDialogElement;
	$: if (menu) {
		if ($isOpened && !menu.open) menu.showModal();
		else if (!$isOpened && menu.open) menu.close();
	}

	function handleClick() {
		isOpened.set(!$isOpened);
	}
</script>

<nav aria-label="Navigazione principale">
	<div class="nav-div">
		<a href="/" class="title desktop"><b>{config.title}</b></a>
		<a href="/" class="home mobile" aria-label="Home"><Icon name="home" size={30} /></a>
		<ul class="links desktop yr-tabs" data-sveltekit-preload-code="viewport">
			<li><a href="/pagine" class:active={page.url.pathname.startsWith('/pagine')}>BLOG</a></li>
			<li>
				<a href="/progetti" class:active={page.url.pathname.startsWith('/progetti')}>PROGETTI</a>
			</li>
			<li><a href="/now" class:active={page.url.pathname === '/now'}>NOW</a></li>
			<li><a href="/data" class:active={page.url.pathname === '/data'}>DATA</a></li>
			<li><a href="/appunti" class:active={page.url.pathname === '/appunti'}>APPUNTI</a></li>
		</ul>
		<ThemeToggle />
		<SearchModal />
		<button
			on:click={handleClick}
			class="button-hamburger mobile"
			aria-label="Apri menu"
			aria-expanded={$isOpened}
			aria-controls="mobile-menu"
		>
			<Icon name="menu" size={28} />
		</button>
	</div>
</nav>
<dialog
	bind:this={menu}
	id="mobile-menu"
	class="hidden-menu yr-tabs"
	aria-label="Menu di navigazione"
	on:close={() => isOpened.set(false)}
>
	<button on:click={handleClick} class="close" aria-label="Chiudi menu">
		<Icon name="close" size={26} />
	</button>
	<a on:click={() => isOpened.set(false)} href="/" class:active={page.url.pathname === '/'}>D.A</a>
	<a
		on:click={() => isOpened.set(false)}
		href="/pagine"
		class:active={page.url.pathname.startsWith('/pagine')}>BLOG</a
	>
	<a
		on:click={() => isOpened.set(false)}
		href="/progetti"
		class:active={page.url.pathname.startsWith('/progetti')}>PROGETTI</a
	>
	<a on:click={() => isOpened.set(false)} href="/now" class:active={page.url.pathname === '/now'}
		>NOW</a
	>
	<a on:click={() => isOpened.set(false)} href="/data" class:active={page.url.pathname === '/data'}
		>DATA</a
	>
	<a
		on:click={() => isOpened.set(false)}
		href="/appunti"
		class:active={page.url.pathname === '/appunti'}>APPUNTI</a
	>
</dialog>

<style>
	a {
		color: inherit;
		text-decoration: none;
		height: fit-content;
	}

	a::after {
		content: '';
		background-image: url('/images/nier-link.png');
		background-size: contain;
		background-repeat: no-repeat;
	}
	nav {
		display: flex;
		flex-direction: column;
		padding-block: var(--size-7);
		justify-content: space-between;
		top: 0;
		z-index: 999;
	}

	nav::after {
		content: '';
		width: 100%;
		height: 30px;
		background-image: url('/images/nier-divider.png');
		background-size: contain;
		background-repeat: repeat;
	}

	.nav-div {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.mobile {
		display: none;
	}

	button,
	.home {
		font: inherit;
		background: none;
		border: 0;
		padding: 0;
		box-shadow: none;
		color: inherit;
	}

	.button-hamburger :global(svg) {
		width: 1.9em;
		height: 1.9em;
	}

	.close :global(svg) {
		width: 1.6em;
		height: 1.6em;
	}

	:global(html[data-theme='dark']) nav::after,
	:global(html[data-theme='dark']) a::after {
		filter: invert(1) hue-rotate(180deg);
	}

	.home::before,
	.home::after {
		display: none;
	}

	@media (max-width: 1300px) {
		.desktop,
		.links.desktop {
			display: none;
		}
		.mobile {
			display: block;
		}
	}

	@media (min-width: 1301px) {
		.hidden-menu {
			display: none;
		}
		.nav-div {
			gap: var(--size-7);
		}
		.title {
			white-space: nowrap;
		}
		.links {
			margin-left: auto;
		}
	}

	.links {
		margin-block: var(--size-7);
		display: flex;
		gap: 0.45rem;
		margin-block: 0;
	}

	.links a,
	.hidden-menu a {
		height: auto;
		text-shadow: none;
		color: var(--automataColor);
		background-color: var(--yr-muted);
		transition: none;
	}

	.links a:hover,
	.links a:focus-visible,
	.links a.active,
	.hidden-menu a:hover,
	.hidden-menu a:focus-visible,
	.hidden-menu a.active {
		color: var(--automataBg);
		background-color: var(--yr-accent);
	}

	.links a::before,
	.hidden-menu a::before {
		content: '';
		position: static;
		z-index: auto;
		flex: 0 0 0.75rem;
		width: 0.75rem;
		height: 0.75rem;
		background: currentColor;
	}

	.links a::after,
	.hidden-menu a::after {
		display: none;
		content: none;
	}

	.hidden-menu a {
		justify-content: flex-start;
		width: min(100%, 20rem);
		min-height: 2.75rem;
		padding: 0.65rem 1rem;
		gap: 0.75rem;
	}

	li {
		background-image: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}

	/* Desktop */
	.button-hamburger {
		right: 100%;
		width: fit-content;
		cursor: pointer;
		transition: all 0.5s ease-in-out;
		z-index: 3;
	}

	.hidden-menu {
		position: fixed;
		inset: 0;
		background-color: var(--automataBg);
		color: var(--automataColor);
		width: 100%;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		border: 0;
		border-radius: 0;
		box-sizing: border-box;
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		padding: 5rem 1.5rem 2rem;
		overflow-y: auto;
		z-index: 999;
	}

	.hidden-menu[open] {
		display: flex;
	}

	.close {
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		padding: 0.2em;
		opacity: 0.7;
		transition: all 0.2s ease-in-out;
	}

	.close:hover {
		opacity: 1;
	}

	.home {
		opacity: 0.7;
		transition: all 0.3s ease-in-out;
	}

	.home:hover {
		opacity: 1;
	}

	@media (max-width: 800px) {
		nav {
			justify-content: space-between;
			position: sticky;
			background-color: var(--automataBg);
			padding-block: var(--size-4);
			/* Full-bleed: cancel the layout side padding so no bare strips show beside the bar. */
			margin-inline: calc(var(--size-7) * -1);
			padding-inline: var(--size-7);
		}
	}
</style>
