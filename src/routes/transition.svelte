<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let url: string;

	const inTransition = {
		duration: 220,
		easing: cubicOut
	};

	const outTransition = {
		duration: 140,
		easing: cubicOut
	};
</script>

{#key url}
	<div class="transition" in:fade={inTransition} out:fade={outTransition}>
		<slot />
	</div>
{/key}

<style>
	.transition {
		height: 100%;
		will-change: opacity;
	}
</style>
