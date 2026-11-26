<script lang="ts">
	import Modal from './Modal.svelte';
	import { isGalleryVideo } from '#lib/rich-gallery.ts';

	export let images: string | string[] = [];

	let currentIndex = 0;
	let fullscreen = false;
	let startX = 0;
	let startY = 0;
	let startTime = 0;

	$: items = Array.isArray(images) ? images : [images].filter(Boolean);
	$: current = items[currentIndex];
	const pad = (n: number) => String(n).padStart(2, '0');

	function go(to: number) {
		if (items.length) currentIndex = (to + items.length) % items.length;
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
		e.preventDefault();
		go(currentIndex + (e.key === 'ArrowLeft' ? -1 : 1));
	}

	function handleTouchStart(e: TouchEvent) {
		const t = e.changedTouches[0];
		startX = t.pageX;
		startY = t.pageY;
		startTime = Date.now();
	}

	function handleTouchEnd(e: TouchEvent) {
		// Swipes on the video controls belong to the video.
		if (e.target instanceof HTMLVideoElement) return;
		const t = e.changedTouches[0];
		const dx = t.pageX - startX;
		if (Date.now() - startTime > 500 || Math.abs(dx) < 50 || Math.abs(t.pageY - startY) > 160)
			return;
		go(currentIndex + (dx > 0 ? -1 : 1));
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
<div
	class="gallery"
	role="region"
	aria-roledescription="galleria"
	aria-label="Galleria immagini"
	tabindex="0"
	on:keydown={handleKey}
>
	{#if items.length > 0}
		<div class="stage" role="group" on:touchstart={handleTouchStart} on:touchend={handleTouchEnd}>
			{#if isGalleryVideo(current)}
				{#key current}
					<video controls playsinline src={current}><track kind="captions" /></video>
				{/key}
			{:else}
				<button
					class="expand"
					type="button"
					on:click={() => (fullscreen = true)}
					aria-label="Apri immagine a schermo intero"
				>
					<img src={current} alt="Immagine {currentIndex + 1} di {items.length}" />
				</button>
			{/if}

			<span class="counter" role="status">{pad(currentIndex + 1)} / {pad(items.length)}</span>

			{#if items.length > 1}
				<button
					class="arrow prev"
					type="button"
					on:click={() => go(currentIndex - 1)}
					aria-label="Precedente"
				>
					<span class="material-symbols-outlined">arrow_back</span>
				</button>
				<button
					class="arrow next"
					type="button"
					on:click={() => go(currentIndex + 1)}
					aria-label="Successiva"
				>
					<span class="material-symbols-outlined">arrow_forward</span>
				</button>
			{/if}
		</div>

		{#if items.length > 1}
			<ul class="thumbs">
				{#each items as item, i (item + i)}
					<li>
						<button
							type="button"
							class:active={i === currentIndex}
							aria-current={i === currentIndex}
							aria-label="Vai al contenuto {i + 1}"
							on:click={() => go(i)}
						>
							{#if isGalleryVideo(item)}
								<video src={item} preload="metadata" muted playsinline tabindex="-1"></video>
								<span class="play" aria-hidden="true">▶</span>
							{:else}
								<img src={item} alt="" loading="lazy" />
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		<Modal bind:showModal={fullscreen} isSearch={false}>
			<img class="modal-image" src={current} alt="" />
		</Modal>
	{:else}
		<p>Nessun contenuto da mostrare.</p>
	{/if}
</div>

<style>
	.gallery {
		width: 100%;
		max-width: 1000px;
		margin: 1.5rem auto;
		padding: 0;
		outline-offset: 4px;
	}

	.stage {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--yr-muted);
		border: 1px solid var(--yr-line-strong);
		touch-action: pan-y;
	}

	.stage img,
	.stage video {
		display: block;
		width: 100%;
		height: 100%;
		margin: 0;
		object-fit: contain;
	}

	.expand {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: zoom-in;
	}

	.counter {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.2rem 0.6rem;
		background: var(--automataColor);
		color: var(--automataBg);
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		pointer-events: none;
	}

	/* Arrows sit on the stage edges so the image keeps the whole width. */
	.arrow {
		position: absolute;
		top: 50%;
		width: 2.5rem;
		height: 3.5rem;
		transform: translateY(-50%);
		display: grid;
		place-items: center;
		padding: 0;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		background: var(--automataBg);
		color: var(--automataColor);
		opacity: 0.85;
		text-transform: none;
	}

	.arrow.prev {
		left: 0.5rem;
	}

	.arrow.next {
		right: 0.5rem;
	}

	.arrow:hover,
	.arrow:focus-visible {
		opacity: 1;
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.thumbs {
		display: flex;
		gap: 0.5rem;
		margin: 0.6rem 0 0;
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
		width: 5.5rem;
		aspect-ratio: 4 / 3;
		padding: 0;
		border: 1px solid var(--yr-line);
		border-radius: 0;
		background: var(--yr-muted);
		opacity: 0.55;
		overflow: hidden;
		transition: opacity 0.2s;
	}

	.thumbs button:hover,
	.thumbs button:focus-visible {
		opacity: 1;
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
		font-size: 1.1rem;
		text-shadow: 0 0 6px rgb(0 0 0 / 70%);
	}

	.modal-image {
		max-width: 100%;
		height: auto;
		cursor: auto;
	}

	@media (max-width: 600px) {
		.arrow {
			width: 2rem;
			height: 3rem;
		}
		.thumbs button {
			width: 4rem;
		}
	}
</style>
