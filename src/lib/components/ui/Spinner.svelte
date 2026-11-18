<script lang="ts">
	let { size = 20, label = 'Caricamento' }: { size?: number; label?: string } = $props();
</script>

<span
	class="yr-spinner"
	style={`--spinner-size:${size}px`}
	role={label ? 'status' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
></span>

<style>
	.yr-spinner {
		display: inline-block;
		flex: 0 0 auto;
		width: var(--spinner-size, 1.25rem);
		height: var(--spinner-size, 1.25rem);
		box-sizing: border-box;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		animation: yr-spin 0.9s steps(8, end) infinite;
	}

	@keyframes yr-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.yr-spinner {
			animation-duration: 2.4s;
		}
	}
</style>
