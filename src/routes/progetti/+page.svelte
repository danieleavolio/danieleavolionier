<script lang="ts">
	import { formatDate } from '$lib/utils';
	import * as config from '$lib/config';

	export let data;
</script>

<svelte:head>
	<title>{config.title} Projects</title>
</svelte:head>

<section>
	<ul class="posts">
		{#each data.progetti as progetto}
			<li class="post">
				<a href="progetti/{progetto.slug}" class="title">{progetto.title}</a>
				<p class="date">{formatDate(progetto.date)}</p>
				<p class="description">{progetto.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>

	
	a{
		z-index: 10;
	}
	.post {
		display: grid;
		gap: 1.2rem;
		transition: all 0.5s ease-in-out;
	}

	.post:not(:last-child) {
		padding-bottom: var(--size-7);
	}

	.post:hover{
		background-color: var(--automataBg);
	}

	.title {
		font-size: var(--font-size-fluid-2);
		text-transform: capitalize;
	}

	.date {
		color: var(--text-2);
	}

	.description {
		margin-top: var(--size-3);
	}
</style>
