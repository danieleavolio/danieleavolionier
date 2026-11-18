<script lang="ts">
	import { onDestroy } from 'svelte';

	let frame: HTMLButtonElement;
	let angle = 0;
	let tilt = 0;
	let velocity = 0;
	let dragging = false;
	let lastX = 0;
	let lastY = 0;
	let raf = 0;

	function momentum() {
		velocity *= 0.95;
		tilt *= 0.9;
		angle += velocity;
		if (Math.abs(velocity) > 0.04 || Math.abs(tilt) > 0.1) {
			raf = requestAnimationFrame(momentum);
		}
	}

	function onPointerDown(event: PointerEvent) {
		cancelAnimationFrame(raf);
		velocity = 0;
		dragging = true;
		lastX = event.clientX;
		lastY = event.clientY;
		try {
			frame.setPointerCapture(event.pointerId);
		} catch {
			// Synthetic events and some touch contexts do not support capture.
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		const dx = event.clientX - lastX;
		const dy = event.clientY - lastY;
		lastX = event.clientX;
		lastY = event.clientY;
		velocity = dx * 0.7;
		tilt = Math.max(-16, Math.min(16, tilt - dy * 0.25));
		angle += velocity;
	}

	function onPointerUp(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		try {
			if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
		} catch {
			// Nothing to release when capture was unavailable.
		}
		if (Math.abs(velocity) > 0.04) raf = requestAnimationFrame(momentum);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			cancelAnimationFrame(raf);
			angle -= 15;
			event.preventDefault();
		} else if (event.key === 'ArrowRight') {
			cancelAnimationFrame(raf);
			angle += 15;
			event.preventDefault();
		}
	}

	onDestroy(() => {
		if (typeof window !== 'undefined') cancelAnimationFrame(raf);
	});
</script>

<button
	type="button"
	class="avatar-photo"
	class:dragging
	bind:this={frame}
	aria-label="Ritratto di Daniele Avolio. Trascina con mouse o touch per ruotare e vedere Emi dietro."
	style="--angle:{angle}deg; --tilt:{tilt}deg"
	on:pointerdown={onPointerDown}
	on:pointermove={onPointerMove}
	on:pointerup={onPointerUp}
	on:pointercancel={onPointerUp}
	on:keydown={onKeydown}
>
	<div class="avatar-rotor">
		<div class="avatar-face avatar-front">
			<img
				src="/images/avatar-640.webp"
				srcset="/images/avatar-320.webp 320w, /images/avatar-640.webp 640w"
				sizes="240px"
				alt=""
				width="640"
				height="640"
				decoding="async"
				draggable="false"
				on:dragstart|preventDefault
			/>
		</div>
		<div class="avatar-face avatar-back" aria-hidden="true"></div>
	</div>
</button>

<style>
	.avatar-photo {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		padding: 0;
		border: 0;
		border-radius: 50% !important;
		background: transparent;
		box-shadow: none !important;
		font: inherit;
		color: inherit;
		outline: none !important;
		user-select: none;
		perspective: 600px;
		cursor: grab;
		touch-action: none;
	}

	/* open-props paints a ring on button hover/active/focus; the avatar never shows it. */
	.avatar-photo:hover,
	.avatar-photo:focus,
	.avatar-photo:focus-visible,
	.avatar-photo:active {
		border: 0;
		outline: none !important;
		box-shadow: none !important;
	}

	.avatar-photo.dragging {
		cursor: grabbing;
	}

	.avatar-rotor {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform: rotateX(var(--tilt)) rotateY(var(--angle));
		transition: transform 0.05s linear;
	}

	.dragging .avatar-rotor {
		transition: none;
	}

	.avatar-face {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		overflow: hidden;
		backface-visibility: hidden;
	}

	.avatar-front img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		box-shadow: none;
		-webkit-user-drag: none;
	}

	.avatar-back {
		transform: rotateY(180deg);
		background-image: url('/images/emil-pixelart.webp');
		background-size: cover;
		background-position: center;
	}
</style>
