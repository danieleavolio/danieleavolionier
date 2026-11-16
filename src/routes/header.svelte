<script lang="ts">
	import * as config from '#lib/config.ts';
	import { Settings, ArrowDown01, Home } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	//Import store and set to true on click
	import isOpened from '#lib/stores/navstore.ts';
	import SearchModal from '#lib/components/SearchModal.svelte';

	function handleClick() {
		isOpened.set(!$isOpened);
		if (isOpened) {
			window.document.body.style.scrollBehavior = 'unset';
			window.scrollTo(0, 0);
		}
	}
</script>

<nav aria-label="Navigazione principale">
	<div class="nav-div">
		<a href="/" class="title desktop"><b>{config.title}</b></a>
		<a href="/" class="home mobile" aria-label="Home"><Home fill-opacity="0" size="2.5em" /></a>
		<ul class="links desktop" data-sveltekit-preload-code="viewport">
			<li><a href="/pagine">BLOG</a></li>
			<li><a href="/progetti">PROGETTI</a></li>
			<li><a href="/now">NOW</a></li>
			<li><a href="/data">DATA</a></li>
			<li><a href="/appunti">APPUNTI</a></li>
		</ul>
		<SearchModal />
		<button
			on:click={handleClick}
			class="button-hamburger mobile"
			aria-label="Apri menu"
			aria-expanded={$isOpened}
		>
			<Settings fill-opacity="0" size="2.5em" />
		</button>
	</div>
</nav>
{#if $isOpened}
	<div transition:fly={{ y: 1000, duration: 300, opacity: 1 }} class="hidden-menu">
		<button on:click={handleClick} class="close" aria-label="Chiudi menu">
			<ArrowDown01 cursor="pointer" size="3em" fill-opacity="0" />
		</button>
		<a on:click={() => handleClick()} href="/">D.A</a>
		<a on:click={() => handleClick()} href="/pagine">BLOG</a>
		<a on:click={() => handleClick()} href="/progetti">PROGETTI</a>
		<a on:click={() => handleClick()} href="/now">NOW</a>
		<a on:click={() => handleClick()} href="/data">DATA</a>
		<a on:click={() => handleClick()} href="/appunti">APPUNTI</a>
	</div>
{/if}

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
		width: 2.5em;
		height: 2.5em;
	}

	.close :global(svg) {
		width: 3em;
		height: 3em;
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
		gap: var(--size-7);
		margin-block: 0;
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

	.button-hamburger:hover {
		transform: rotate(90deg);
	}

	.hidden-menu {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: var(--automataBg);
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--size-7);
		padding: 1em;
		transition: all 0.5s ease-in-out;
		z-index: 999;
	}

	.hidden-menu a {
		width: 90%;
	}

	.close {
		position: absolute;
		bottom: 3rem;
		right: 10px;
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
		transform: rotate(-90deg);
	}

	@media (max-width: 800) {
		nav {
			justify-content: space-between;
			position: sticky;
		}
	}
</style>
