<script lang="ts">
	import * as config from '$lib/config';
</script>

<nav>
	<a href="/" class="title">
		<b>{config.title}</b>
	</a>

	<ul class="links">
		<li><a href="/about">About</a></li>
	</ul>
</nav>

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
</style>
