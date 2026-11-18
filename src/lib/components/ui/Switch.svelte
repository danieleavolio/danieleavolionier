<script lang="ts">
	let {
		checked = $bindable(false),
		label = '',
		name = '',
		value = 'true',
		disabled = false
	}: {
		checked?: boolean;
		label?: string;
		name?: string;
		value?: string;
		disabled?: boolean;
	} = $props();
</script>

<label class="yr-switch" class:disabled>
	<input type="checkbox" {name} {value} bind:checked {disabled} />
	<span class="track" aria-hidden="true"></span>
	{#if label}<span class="text">{label}</span>{/if}
</label>

<style>
	.yr-switch {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		cursor: pointer;
		user-select: none;
	}

	.yr-switch.disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.track {
		position: relative;
		flex: 0 0 auto;
		width: 2.4rem;
		height: 1.3rem;
		box-sizing: border-box;
		border: 1px solid var(--automataColor);
		background-color: var(--yr-surface, var(--automataBg));
		transition: background-color 0.12s steps(2, end);
	}

	.track::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 0.9rem;
		height: 0.9rem;
		background-color: var(--automataColor);
		transition: transform 0.12s steps(2, end);
	}

	input:checked + .track {
		background-color: var(--automataColor);
	}

	input:checked + .track::after {
		background-color: var(--automataBg);
		transform: translateX(1.05rem);
	}

	input:focus-visible + .track {
		outline: 2px solid var(--automataRed);
		outline-offset: 3px;
	}

	.text {
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.14rem;
		text-transform: uppercase;
	}

	@media (prefers-reduced-motion: reduce) {
		.track,
		.track::after {
			transition: none;
		}
	}
</style>
