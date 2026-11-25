<script lang="ts">
	import {
		coverStepKinds,
		drawStepIcon,
		resolveCoverColor,
		type CoverStepKind,
		type CoverTheme
	} from '#lib/editor/cover-render.ts';

	let {
		value = $bindable('box'),
		color = 'ink',
		theme = 'chiaro'
	}: { value?: CoverStepKind; color?: string; theme?: CoverTheme } = $props();

	let open = $state(false);
	let root: HTMLDivElement;

	/** Paints one icon on its own small canvas. */
	function icon(
		canvas: HTMLCanvasElement,
		params: { kind: CoverStepKind; color: string }
	): { update: (next: { kind: CoverStepKind; color: string }) => void } {
		const paint = (next: { kind: CoverStepKind; color: string }) => {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawStepIcon(ctx, next, 0, canvas.width / 2, canvas.height / 2);
		};
		paint(params);
		return { update: paint };
	}

	const tint = $derived(resolveCoverColor(theme, color));
	const label = $derived(coverStepKinds.find((kind) => kind.value === value)?.label ?? 'Icona');

	function pick(kind: CoverStepKind) {
		value = kind;
		open = false;
	}

	function closeOutside(event: PointerEvent) {
		if (open && !root.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onpointerdown={closeOutside} />

<div class="icon-picker" bind:this={root}>
	<button
		type="button"
		class="current"
		aria-haspopup="true"
		aria-expanded={open}
		title={label}
		aria-label={`Icona: ${label}`}
		onclick={() => (open = !open)}
	>
		<canvas width="56" height="56" use:icon={{ kind: value, color: tint }}></canvas>
	</button>
	{#if open}
		<div
			class="grid"
			role="listbox"
			aria-label="Icone"
			tabindex="-1"
			onkeydown={(event) => event.key === 'Escape' && ((open = false), event.stopPropagation())}
		>
			{#each coverStepKinds as kind (kind.value)}
				<button
					type="button"
					role="option"
					class:on={kind.value === value}
					aria-selected={kind.value === value}
					title={kind.label}
					aria-label={kind.label}
					onclick={() => pick(kind.value)}
				>
					<canvas width="56" height="56" use:icon={{ kind: kind.value, color: tint }}></canvas>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.icon-picker {
		position: relative;
		flex: none;
	}

	.current,
	.grid button {
		display: grid;
		place-items: center;
		padding: 0.15rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: inherit;
		background: var(--automataBg);
		cursor: pointer;
	}

	canvas {
		display: block;
		inline-size: 2rem;
		block-size: 2rem;
	}

	.grid {
		position: absolute;
		z-index: 5;
		inset-block-start: calc(100% + 0.25rem);
		inset-inline-start: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		box-sizing: border-box;
		inline-size: 13rem;
		gap: 0.25rem;
		max-block-size: 11.5rem;
		padding: 0.4rem;
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		box-shadow: 4px 4px 0 var(--yr-line-strong);
	}

	.grid button.on {
		outline: 2px solid var(--automataColor);
		outline-offset: -2px;
	}
</style>
