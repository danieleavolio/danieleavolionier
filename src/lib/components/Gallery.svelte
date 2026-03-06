<script lang="ts">
	import Modal from './Modal.svelte';

	export let images: string | any[] = [];
	let currentIndex = 0;
	let imageClicked = false;

	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prevImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	let startX: number;
	let startY: number;
	let dist: number;
	const threshold = 50;
	const restraint = 160;
	const allowedTime = 500;
	let elapsedTime: number;
	let startTime: number;

	function handleTouchStart(e: TouchEvent) {
		const touchobj = e.changedTouches[0];
		dist = 0;
		startX = touchobj.pageX;
		startY = touchobj.pageY;
		startTime = new Date().getTime();
	}

	function handleTouchMove(e: TouchEvent) {
		e.preventDefault();
	}

	function handleTouchEnd(e: TouchEvent) {
		const touchobj = e.changedTouches[0];
		dist = touchobj.pageX - startX;
		elapsedTime = new Date().getTime() - startTime;
		if (
			elapsedTime <= allowedTime &&
			Math.abs(dist) >= threshold &&
			Math.abs(touchobj.pageY - startY) <= restraint
		) {
			if (dist > 0) {
				prevImage();
			} else {
				nextImage();
			}
		}
	}
</script>

<div
	class="gallery"
	role="region"
	aria-label="Galleria immagini"
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
>
	<div class="image-container">
		{#if images.length > 0}
			{#if images[currentIndex].includes('mp4')}
				<video controls src={images[currentIndex]}></video>
			{:else}
				<img
					on:click={() => (imageClicked = !imageClicked)}
					src={images[currentIndex]}
					alt="Image Gallery"
				/>
			{/if}

			<Modal bind:showModal={imageClicked} isSearch={false}>
				{#if images[currentIndex].includes('mp4')}
					<video controls src={images[currentIndex]}></video>
				{:else}
					<img class="modal-image" src={images[currentIndex]} alt="Image Gallery" />
				{/if}
			</Modal>
		{:else}
			<p>Qualcosa e andato stortissimo...</p>
		{/if}
	</div>
	<div class="controls">
		<button on:click={prevImage} disabled={images.length === 0}
			><span class="material-symbols-outlined"> arrow_back </span></button
		>
		<div class="indicator">
			{#if images.length > 0}
				<p>{currentIndex + 1}/{images.length}</p>
			{/if}
		</div>
		<button on:click={nextImage} disabled={images.length === 0}
			><span class="material-symbols-outlined"> arrow_forward</span></button
		>
	</div>
</div>

<style>
	.gallery {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
		padding: 1.2em;
	}
	.image-container {
		width: 100%;
		overflow: hidden;
		border: 1px solid var(--automataBlackOpacity);
		border-radius: 5px;
	}
	.image-container img,
	.image-container video {
		width: 100%;
		height: auto;
		aspect-ratio: 16/9;
		object-fit: cover;
	}
	.controls {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-top: 10px;
	}
	.controls button {
		padding: 10px;
	}
	.indicator {
		margin-top: 10px;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.indicator p {
		margin: 0;
	}

	button {
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		text-transform: uppercase;
		transition: background-color 0.3s;
		width: 100px;
	}

	button:hover {
		background-color: var(--automataBlackO);
	}

	.image-container img {
		cursor: pointer;
	}

	.modal-image {
		max-width: 100%;
		height: auto;
		cursor: auto !important;
	}
</style>
