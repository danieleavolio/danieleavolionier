<script lang="ts">
	import * as config from '$lib/config';
	import { Settings, ArrowDown01, Home } from 'lucide-svelte';
	let width = 0;
	import { fly } from 'svelte/transition';

	//Import store and set to true on click
	import isOpened from '$lib/stores/navstore';
	import { goto } from '$app/navigation';

	function goHome() {
		goto('/');
	}
	function handleClick() {
		isOpened.set(!$isOpened);
		if (isOpened) {
			window.document.body.style.scrollBehavior = 'unset';
			window.scrollTo(0, 0);
		}
	}
</script>

<svelte:window bind:innerWidth={width} />

<nav>
	<div class="nav-div">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		{#if width > 1300}
			<a href="/" class="title">
				<b>{config.title}</b>
			</a>

			<ul class="links">
				<li><a href="/pagine">BLOG</a></li>
				<li><a href="/progetti">PROGETTI</a></li>
				<li><a href="/data">DATA</a></li>
				<li><a href="/appunti">APPUNTI</a></li>
			</ul>
		{:else}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="home" on:click={() => goHome()}>
				<Home cursor="pointer" fill-opacity="0" size="2.5em" />
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={() => handleClick()} class="button-hamburger">
				<Settings fill-opacity="0" size="2.5em" />
			</div>
		{/if}
	</div>
</nav>
{#if $isOpened && width < 1300}
	<div transition:fly={{ y: 1000, duration: 300, opacity: 1 }} class="hidden-menu">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click={() => handleClick()} class="close">
			<ArrowDown01 cursor="pointer" size="3em" fill-opacity="0" />
		</div>
		<a on:click={() => handleClick()} href="/">D.A</a>
		<a on:click={() => handleClick()} href="/pagine">BLOG</a>
		<a on:click={() => handleClick()} href="/progetti">PROGETTI</a>
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
		background-image: url('https://i.imgur.com/h8f3hwW.png');
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
		background-image: url('https://i.imgur.com/FMYB47Q.png');
		background-size: contain;
		background-repeat: repeat;
	}

	.nav-div {
		display: flex;
		justify-content: space-between;
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
