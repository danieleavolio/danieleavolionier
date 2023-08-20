<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';
	import Profile from './profile.svelte';
	import {Diamond, Square} from "lucide-svelte";
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>
<div class="separator">
	<section class="section-1">
		<li class="post">
			<div class="items-container">
				<a href="data" class="title"><Diamond /> Data</a>
				<a href="pagine" class="title"><Diamond /> Projects</a>
				<a href="pagine" class="title"><Diamond /> Blog</a>
			</div>
		</li>
	</section>
	<section class="section-2"><Profile /></section>
</div>

<style>
	a {
		position: relative;
		font-size: var(--font-size-fluid-1) !important;
		padding-left: 1em;
		text-align: left;
		display: flex;
		gap: 0.2em;

	}

	li {
		display: flex !important;
		align-items: center;
		padding-top: 0;
		padding-bottom: 0;

	}
	.separator {
		display: flex;
		flex-direction: column;
		flex-direction: column-reverse;
		justify-content: space-around;
		align-items: center;
		gap: 4rem;
	}

	.section-1 {
		width: 100%;
		height: fit-content;
		flex: 2 1 20em;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.section-2 {
		justify-content: center;
		align-items: center;
	}

	.items-container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		padding: 2em;
		background-color: var(--automataBg);
		z-index: 10;
	}

	.title {
		font-size: var(--font-size-fluid-2);
		text-transform: capitalize;
	}



	@media (min-width: 1400px) {
		.separator {
			flex-direction: row;
		}
		.section-1 {
			flex: 1 1 20em;
			width: 100%;
		}
		.section-2 {
			flex: 1 1 50em;
		}
	}
</style>
