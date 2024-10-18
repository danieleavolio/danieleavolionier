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
</script>

<div class="gallery">
	<div class="image-container">
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		{#if images.length > 0}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if images[currentIndex].includes('mp4')}
				<video
					controls
					src={images[currentIndex]}
					alt="Image Gallery"
				/>
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
				<img class="modal-image" src={images[currentIndex]} alt="Image Gallery" />
			</Modal>
		{:else}
			<p>No images available</p>
		{/if}
	</div>
	<div class="controls">
		<button on:click={prevImage} disabled={images.length === 0}
			><span class="material-symbols-outlined"> arrow_back </span></button
		>
		<button on:click={nextImage} disabled={images.length === 0}
			><span class="material-symbols-outlined"> arrow_forward</span></button
		>
	</div>
	<div class="indicator">
		{#if images.length > 0}
			<p>{currentIndex + 1}/{images.length}</p>
		{/if}
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
	.gallery {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.image-container {
		position: relative;
	}
	.image-container img {
		max-width: 100%;
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
	}

	button {
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		text-transform: uppercase;
		transition: background-color 0.3s;
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
