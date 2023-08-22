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
	}
</script>

<svelte:window bind:innerWidth={width} />

<nav>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	{#if width > 800}
		<a href="/" class="title">
			<b>{config.title}</b>
		</a>

		<ul class="links">
			<li><a href="/pagine">BLOG</a></li>
			<li><a href="/progetti">PROJECTS</a></li>
			<li><a href="/data">DATA</a></li>
		</ul>
	{:else}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => goHome()}>
			<Home fill-opacity="0" size="2.5em" />
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={() => handleClick()} class="button-hamburger">
			<Settings fill-opacity="0" size="2.5em" />
		</div>
	{/if}
</nav>
{#if $isOpened && width < 800}
	<div transition:fly={{ y: 1000, duration: 300, opacity: 1 }} class="hidden-menu">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click={() => handleClick()} class="close">
			<ArrowDown01 cursor="pointer" size="3em" fill-opacity="0" />
		</div>
		<a on:click={() => handleClick()} href="/">D.A</a>
		<a on:click={() => handleClick()} href="/pagine">BLOG</a>
		<a on:click={() => handleClick()} href="/progetti">PROJECTS</a>
		<a on:click={() => handleClick()} href="/data">DATA</a>
	</div>
{/if}

<style>
	a {
		color: inherit;
		text-decoration: none;
		height: fit-content;
	}
	nav {
		display: flex;
		padding-block: var(--size-7);
		justify-content: space-between;
		position: relative;
	}

	.links {
		margin-block: var(--size-7);
		display: flex;
		gap: var(--size-7);
		margin-block: 0;
	}

	li {
		background-image: none;
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

	@media (max-width: 800px) {
		nav {
			justify-content: space-between;
		}
	}
</style>
