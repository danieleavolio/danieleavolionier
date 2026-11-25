<script lang="ts">
	import { coverSwatches, resolveCoverColor, type CoverTheme } from '#lib/editor/cover-render.ts';

	let {
		value = $bindable('ink'),
		theme = 'chiaro',
		label = 'Colore'
	}: { value?: string; theme?: CoverTheme; label?: string } = $props();

	const custom = $derived(value.startsWith('#'));
</script>

<div class="picker" role="group" aria-label={label}>
	{#each coverSwatches as swatch (swatch.value)}
		<button
			type="button"
			class="dot"
			class:on={value === swatch.value}
			style:background={swatch[theme]}
			title={swatch.label}
			aria-label={swatch.label}
			aria-pressed={value === swatch.value}
			onclick={() => (value = swatch.value)}
		></button>
	{/each}
	<label
		class="dot custom"
		class:on={custom}
		style:background={custom ? value : undefined}
		title="Colore personalizzato"
	>
		<span class="visually-hidden">Colore personalizzato</span>
		<input
			type="color"
			value={resolveCoverColor(theme, value)}
			oninput={(event) => (value = event.currentTarget.value)}
		/>
	</label>
</div>

<style>
	.picker {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.dot {
		position: relative;
		box-sizing: border-box;
		inline-size: 1.4rem;
		block-size: 1.4rem;
		padding: 0;
		overflow: hidden;
		border: 2px solid transparent;
		border-radius: 50%;
		outline: 1px solid var(--yr-line-strong);
		cursor: pointer;
	}

	.dot.on {
		outline: 2px solid var(--automataColor);
		outline-offset: 1px;
	}

	.custom {
		background: conic-gradient(#cd674d, #a9822f, #69753f, #47697a, #8b5a9e, #cd674d);
	}

	.custom input {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		padding: 0;
		border: 0;
		opacity: 0;
		cursor: pointer;
	}

	.visually-hidden {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
</style>
