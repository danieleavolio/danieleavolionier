<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let url: string;

	const inTransition = {
		duration: 260,
		easing: cubicOut
	};

	const outTransition = {
		duration: 170,
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
		position: relative;
		height: 100%;
		isolation: isolate;
		will-change: opacity, filter;
		animation: pixel-enter 280ms steps(6, end);
	}

	.transition::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 20;
		opacity: 0;
		mix-blend-mode: multiply;
		background-image:
			linear-gradient(90deg, rgba(77, 73, 62, 0.5) 1px, transparent 1px),
			linear-gradient(rgba(77, 73, 62, 0.4) 1px, transparent 1px);
		background-size:
			24px 24px,
			24px 24px;
		animation: pixel-overlay 280ms steps(6, end);
	}

	@keyframes pixel-enter {
		0% {
			filter: contrast(1.2) saturate(0.9) blur(0.8px);
		}
		100% {
			filter: none;
		}
	}

	@keyframes pixel-overlay {
		0% {
			opacity: 0.35;
			background-size:
				26px 26px,
				26px 26px;
		}
		60% {
			opacity: 0.18;
			background-size:
				12px 12px,
				12px 12px;
		}
		100% {
			opacity: 0;
			background-size:
				4px 4px,
				4px 4px;
		}
	}
</style>
