<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let url: string;

	const inTransition = {
		duration: 320,
		easing: cubicOut
	};

	const outTransition = {
		duration: 180,
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
		will-change: opacity, filter, transform;
		animation: glitch-enter 320ms steps(7, end);
	}

	.transition::before,
	.transition::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 20;
		opacity: 0;
	}

	.transition::before {
		mix-blend-mode: multiply;
		background-image:
			linear-gradient(90deg, rgba(77, 73, 62, 0.7) 2px, transparent 2px),
			linear-gradient(rgba(77, 73, 62, 0.55) 2px, transparent 2px);
		background-size:
			34px 34px,
			34px 34px;
		animation: pixel-overlay 320ms steps(8, end);
	}

	.transition::after {
		mix-blend-mode: color-burn;
		background:
			repeating-linear-gradient(
				0deg,
				rgba(0, 0, 0, 0.28) 0 2px,
				rgba(255, 255, 255, 0.06) 2px 4px,
				transparent 4px 8px
			),
			linear-gradient(90deg, rgba(205, 103, 77, 0.22), rgba(77, 73, 62, 0.18));
		animation: scan-flicker 320ms steps(10, end);
	}

	@keyframes glitch-enter {
		0% {
			filter: contrast(1.6) saturate(0.7) blur(1.2px);
			transform: translateY(2px) scale(1.002);
		}
		35% {
			filter: contrast(1.35) saturate(0.85);
			transform: translateY(-1px);
		}
		100% {
			filter: none;
			transform: none;
		}
	}

	@keyframes pixel-overlay {
		0% {
			opacity: 0.48;
			background-size:
				38px 38px,
				38px 38px;
		}
		50% {
			opacity: 0.28;
			background-size:
				18px 18px,
				18px 18px;
		}
		100% {
			opacity: 0;
			background-size:
				4px 4px,
				4px 4px;
		}
	}

	@keyframes scan-flicker {
		0% {
			opacity: 0.35;
			transform: translateX(3px);
		}
		30% {
			opacity: 0.18;
			transform: translateX(-2px);
		}
		60% {
			opacity: 0.12;
			transform: translateX(1px);
		}
		100% {
			opacity: 0;
			transform: none;
		}
	}
</style>
