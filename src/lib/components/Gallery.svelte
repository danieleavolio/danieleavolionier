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

	// If phone scrolling is enabled, the user can swipe left or right to change the image
	let startX: number;
	let startY: number;
	let dist: number;
	let threshold = 150; //required min distance traveled to be considered swipe
	let restraint = 100; // maximum distance allowed at the same time in perpendicular direction
	let allowedTime = 300; // maximum time allowed to travel that distance
	let elapsedTime: number;
	let startTime: number;

	function handleTouchStart(e: TouchEvent) {
		let touchobj = e.changedTouches[0];
		dist = 0;
		startX = touchobj.pageX;
		startY = touchobj.pageY;
		startTime = new Date().getTime(); // record time when finger first makes contact with surface
	}

	function handleTouchMove(e: TouchEvent) {
		e.preventDefault(); // prevent scrolling when inside DIV
	}

	function handleTouchEnd(e: TouchEvent) {
		let touchobj = e.changedTouches[0];
		dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
		elapsedTime = new Date().getTime() - startTime; // get time elapsed
		// check that elapsed time is within specified, and distance moved is greater than specified
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
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
>
	<div class="image-container">
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		{#if images.length > 0}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if images[currentIndex].includes('mp4')}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video controls src={images[currentIndex]} />
			{:else}
				<img
					on:click={() => (imageClicked = !imageClicked)}
					src={images[currentIndex]}
					alt="Image Gallery"
				/>
			{/if}
			<!-- If you click the image it will open a modal with the image -->

			<Modal bind:showModal={imageClicked} isSearch={false}>
				<!-- svelte-ignore a11y-img-redundant-alt -->
				{#if images[currentIndex].includes('mp4')}
					<video controls src={images[currentIndex]} />
				{:else}
					<img class="modal-image" src={images[currentIndex]} alt="Image Gallery" />
				{/if}
			</Modal>
		{:else}
			<p>Qualcosa è andato stortissimo...</p>
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
		max-width: 1000px; /* Set a max-width for the gallery */
		margin: 0 auto; /* Center the gallery */
		padding: 1.2em;
	}
	.image-container {
		width: 100%;
		overflow: hidden; /* Ensure the container does not grow with the image */
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
