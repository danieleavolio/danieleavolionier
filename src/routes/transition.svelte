<script lang="ts">
	import { slide } from "svelte/transition";

	export let url: string;
</script>

{#key url}
	<div class="transition" 
		in:slide={{ x: 0, y: 100, duration: 500 }}
		out:slide={{ x: 0, y: -100, duration: 500 }}
	>
		<slot />
	</div>
{/key}

<style>
	.transition {
		height: 100%;
	}
</style>
