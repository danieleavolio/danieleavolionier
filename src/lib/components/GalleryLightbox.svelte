<script lang="ts">
	import { onMount } from 'svelte';

	let {
		items,
		start,
		dismiss
	}: {
		items: { src: string; alt: string; video?: boolean }[];
		start: number;
		dismiss: () => void;
	} = $props();

	let dialog: HTMLDialogElement;
	let current = $state(0);
	onMount(() => {
		current = start;
		dialog.showModal();
	});

	function move(by: number) {
		current = (current + by + items.length) % items.length;
	}

	const pad = (n: number) => String(n).padStart(2, '0');

	let touchX = 0;
	function touchStart(event: TouchEvent) {
		touchX = event.changedTouches[0].pageX;
	}
	function touchEnd(event: TouchEvent) {
		if (event.target instanceof HTMLVideoElement) return;
		const dx = event.changedTouches[0].pageX - touchX;
		if (Math.abs(dx) >= 50) move(dx > 0 ? -1 : 1);
	}

	function handleKey(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		move(event.key === 'ArrowLeft' ? -1 : 1);
	}
</script>

<dialog bind:this={dialog} aria-label="Galleria immagini" onclose={dismiss} onkeydown={handleKey}>
	<div class="bar">
		<p role="status">{pad(current + 1)} / {pad(items.length)}</p>
		<button type="button" onclick={() => dialog.close()}>Chiudi</button>
	</div>
	<div class="stage" ontouchstart={touchStart} ontouchend={touchEnd}>
		{#if items[current].video}
			{#key items[current].src}
				<video src={items[current].src} controls autoplay playsinline
					><track kind="captions" /></video
				>
			{/key}
		{:else}
			<img src={items[current].src} alt={items[current].alt} />
		{/if}
		{#if items.length > 1}
			<button class="arrow prev" type="button" onclick={() => move(-1)} aria-label="Precedente"
				>←</button
			>
			<button class="arrow next" type="button" onclick={() => move(1)} aria-label="Successiva"
				>→</button
			>
		{/if}
	</div>
	{#if items.length > 1}
		<ul class="thumbs">
			{#each items as item, i (item.src)}
				<li>
					<button
						type="button"
						class:active={i === current}
						aria-current={i === current}
						aria-label="Vai al contenuto {i + 1}"
						onclick={() => (current = i)}
					>
						{#if item.video}
							<video src={item.src} preload="metadata" muted playsinline tabindex="-1"></video>
							<span class="play" aria-hidden="true">▶</span>
						{:else}
							<img src={item.src} alt="" loading="lazy" />
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		width: min(64rem, calc(100vw - 1.5rem));
		max-height: calc(100dvh - 1.5rem);
		margin: auto;
		padding: 0.75rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		background: var(--automataBg);
		color: var(--automataColor);
	}

	dialog::backdrop {
		background: rgb(21 21 18 / 80%);
	}

	.stage {
		position: relative;
		display: grid;
		margin-block: 0.75rem;
		background: var(--yr-muted);
		touch-action: pan-y;
	}

	.stage img,
	.stage video {
		display: block;
		width: 100%;
		height: min(55dvh, 42rem);
		object-fit: contain;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	p {
		margin: 0;
		letter-spacing: 0.08em;
	}

	button {
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		background: var(--automataBg);
		color: var(--automataColor);
	}

	button:hover,
	button:focus-visible {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.arrow {
		position: absolute;
		top: 50%;
		width: 2.5rem;
		height: 3.5rem;
		padding: 0;
		transform: translateY(-50%);
		opacity: 0.85;
	}

	.prev {
		left: 0.5rem;
	}

	.next {
		right: 0.5rem;
	}

	.thumbs {
		display: flex;
		gap: 0.5rem;
		margin: 0;
		padding: 0 0 0.3rem;
		list-style: none;
		overflow-x: auto;
	}

	.thumbs li {
		flex: 0 0 auto;
		margin: 0;
		padding: 0;
	}

	.thumbs button {
		position: relative;
		display: block;
		width: 5rem;
		aspect-ratio: 4 / 3;
		padding: 0;
		border-color: var(--yr-line);
		background: var(--yr-muted);
		opacity: 0.55;
		overflow: hidden;
	}

	.thumbs button:hover,
	.thumbs button:focus-visible {
		opacity: 1;
		background: var(--yr-muted);
	}

	.thumbs button.active {
		opacity: 1;
		border-color: var(--automataRed);
		outline: 1px solid var(--automataRed);
	}

	.thumbs img,
	.thumbs video {
		display: block;
		width: 100%;
		height: 100%;
		margin: 0;
		object-fit: cover;
		pointer-events: none;
	}

	.play {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: #fff;
		text-shadow: 0 0 6px rgb(0 0 0 / 70%);
	}
</style>
