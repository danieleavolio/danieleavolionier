<script lang="ts">
	import { fly } from 'svelte/transition';

	export let url: string;
</script>

{#key url}
	<div class="transition" in:fly={{ y: 100, duration: 500 }} out:fly={{ y: -100, duration: 500 }}>
		<slot />
	</div>
{/key}

<style>
	.transition {
		height: 100%;
	}
</style>
