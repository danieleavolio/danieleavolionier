<script lang="ts" module>
	export type InsertKind = 'link' | 'image' | 'video' | 'embed' | 'gallery';
	export type InsertResult =
		| { kind: 'link'; text: string; href: string }
		| { kind: 'unlink' }
		| { kind: 'image'; src: string; alt: string }
		| { kind: 'video' | 'embed'; src: string }
		| { kind: 'gallery'; images: string[] };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { uploadImage } from '#lib/media.ts';
	import { isGalleryUrl } from '#lib/rich-gallery.ts';

	let {
		kind,
		initialText = '',
		initialHref = '',
		apply,
		dismiss
	}: {
		kind: InsertKind;
		initialText?: string;
		initialHref?: string;
		apply: (result: InsertResult) => void;
		dismiss: () => void;
	} = $props();

	const id = $props.id();
	let dialog: HTMLDialogElement;
	let firstField = $state<HTMLInputElement | HTMLTextAreaElement>();

	const titles: Record<InsertKind, string> = {
		link: 'Link',
		image: 'Immagine',
		video: 'Video',
		embed: 'Contenuto incorporato',
		gallery: 'Galleria'
	};

	// svelte-ignore state_referenced_locally
	let text = $state(initialText);
	// svelte-ignore state_referenced_locally
	let url = $state(initialHref);
	let alt = $state('');
	let galleryText = $state('');
	let uploading = $state(0);
	let error = $state('');

	const galleryUrls = $derived(galleryText.split(/\s+/).filter(isGalleryUrl));
	const urlOk = $derived(/^(https?:\/\/|\/|mailto:|#)\S+$/i.test(url.trim()));
	const valid = $derived(kind === 'gallery' ? galleryUrls.length > 0 : urlOk);
	const youtube = $derived(/youtu\.?be/i.test(url));

	onMount(() => {
		dialog.showModal();
		firstField?.focus();
	});

	async function upload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])];
		input.value = '';
		if (!files.length) return;
		error = '';
		uploading += files.length;
		try {
			for (const file of files) {
				const { url: uploaded } = await uploadImage(file);
				if (kind === 'gallery') galleryText = `${galleryText.trim()}\n${uploaded}`.trim();
				else {
					url = uploaded;
					if (!alt) alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
				}
			}
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Caricamento non riuscito.';
		} finally {
			uploading -= files.length;
		}
	}

	function commit(event?: Event) {
		event?.preventDefault();
		if (!valid || uploading) return;
		const src = url.trim();
		if (kind === 'link') apply({ kind, text: text.trim(), href: src });
		else if (kind === 'image') apply({ kind, src, alt: alt.trim() });
		else if (kind === 'gallery') apply({ kind, images: galleryUrls });
		else apply({ kind, src });
		dialog.close();
	}

	function unlink() {
		apply({ kind: 'unlink' });
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	class:wide={kind === 'gallery' || kind === 'image'}
	aria-labelledby={`${id}-heading`}
	onclose={dismiss}
	onkeydown={(event) => {
		event.stopPropagation();
		if (event.key === 'Enter' && !(event.target instanceof HTMLTextAreaElement)) commit(event);
	}}
>
	<header>
		<p class="eyebrow" aria-hidden="true">Inserisci //</p>
		<h2 id={`${id}-heading`}>{titles[kind]}</h2>
	</header>

	<div class="fields">
		{#if kind === 'link'}
			<label>
				Testo da mostrare
				<input
					form=""
					bind:this={firstField}
					bind:value={text}
					placeholder="Se vuoto uso il testo selezionato o l’indirizzo"
				/>
			</label>
			<label>
				Indirizzo
				<input form="" type="url" bind:value={url} placeholder="https://…" />
			</label>
		{:else if kind === 'gallery'}
			<label>
				Immagini o video, uno per riga
				<textarea
					form=""
					rows="6"
					bind:this={firstField}
					bind:value={galleryText}
					placeholder="https://…/foto-1.jpg&#10;https://…/foto-2.jpg"
				></textarea>
			</label>
			<label class="upload">
				<input form="" type="file" accept="image/*" multiple onchange={upload} />
				<span>Carica dal computer</span>
			</label>
			{#if galleryUrls.length}
				<ul class="thumbs" aria-label="Anteprima della galleria">
					{#each galleryUrls as src, index (index)}
						<li>
							{#if /\.(mp4|webm|mov)(\?|$)/i.test(src)}
								<video {src} muted></video>
							{:else}
								<img {src} alt="" loading="lazy" />
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		{:else}
			<label>
				{kind === 'image'
					? 'Indirizzo dell’immagine'
					: kind === 'video'
						? 'Link YouTube o file video (.mp4, .webm)'
						: 'Indirizzo della pagina da incorporare'}
				<input form="" type="url" bind:this={firstField} bind:value={url} placeholder="https://…" />
			</label>
			{#if kind === 'image'}
				<label class="upload">
					<input form="" type="file" accept="image/*" onchange={upload} />
					<span>Oppure carica dal computer</span>
				</label>
				<label>
					Descrizione (per chi non vede l’immagine e per Google)
					<input form="" bind:value={alt} placeholder="Cosa mostra l’immagine?" />
				</label>
				{#if urlOk}
					<img class="preview" src={url} alt="" />
				{/if}
			{:else if kind === 'video' && urlOk && !youtube}
				<!-- svelte-ignore a11y_media_has_caption -->
				<video class="preview" src={url} controls></video>
			{:else if kind === 'video' && youtube}
				<p class="hint">YouTube: il video verrà incorporato nell’articolo.</p>
			{/if}
		{/if}

		{#if uploading}
			<p class="hint" role="status">Caricamento in corso ({uploading})…</p>
		{/if}
		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}
	</div>

	<footer>
		{#if kind === 'link' && initialHref}
			<button type="button" class="ghost danger" onclick={unlink}>Rimuovi link</button>
		{/if}
		<span class="spacer"></span>
		<button type="button" class="ghost" onclick={() => dialog.close()}>Annulla</button>
		<button type="button" class="primary" disabled={!valid || uploading > 0} onclick={commit}>
			{kind === 'link' && initialHref ? 'Aggiorna' : 'Inserisci'}
		</button>
	</footer>
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		inline-size: min(30rem, calc(100vw - 1.5rem));
		max-block-size: calc(100dvh - 1.5rem);
		margin: auto;
		padding: 0;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBg);
		box-shadow: 6px 6px 0 rgb(0 0 0 / 18%);
	}

	dialog.wide {
		inline-size: min(40rem, calc(100vw - 1.5rem));
	}

	dialog[open] {
		animation: panel-in 0.14s ease-out;
	}

	@keyframes panel-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	dialog::backdrop {
		background: rgb(21 21 18 / 45%);
	}

	header {
		padding: 0.7rem 1rem;
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.eyebrow,
	h2 {
		margin: 0;
		font-family: var(--font-mono);
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.eyebrow {
		font-size: 0.65rem;
		opacity: 0.7;
	}

	h2 {
		font-size: 1rem;
		color: inherit;
	}

	.fields {
		display: grid;
		gap: 0.85rem;
		padding: 1rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	input:not([type='file']),
	textarea {
		box-sizing: border-box;
		inline-size: 100%;
		margin: 0;
		padding: 0.55rem 0.65rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBgRGBA, transparent);
		font: inherit;
		font-family: var(--font-mono);
		font-size: 0.9rem;
		letter-spacing: normal;
		text-transform: none;
	}

	input:focus,
	textarea:focus {
		outline: 2px solid var(--automataColor);
		outline-offset: -1px;
	}

	.upload input {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		opacity: 0;
	}

	.upload span {
		display: block;
		padding: 0.7rem;
		border: 1px dashed var(--yr-line-strong);
		text-align: center;
		cursor: pointer;
	}

	.upload:hover span,
	.upload:focus-within span {
		border-style: solid;
		background: var(--automataBgRGBA);
	}

	.preview {
		max-inline-size: 100%;
		max-block-size: 14rem;
		margin: 0;
		object-fit: contain;
		border: 1px solid var(--yr-line);
	}

	.thumbs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.thumbs li {
		margin: 0;
		padding: 0;
		background: none;
	}

	.thumbs img,
	.thumbs video {
		display: block;
		inline-size: 100%;
		aspect-ratio: 1;
		margin: 0;
		object-fit: cover;
		border: 1px solid var(--yr-line);
	}

	.hint,
	.error {
		margin: 0;
		font-size: 0.85rem;
	}

	.error {
		padding: 0.4rem 0.6rem;
		border: 1px solid var(--automataRed);
		color: var(--automataRed);
	}

	footer {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-top: 1px dashed var(--yr-line);
	}

	.spacer {
		flex: 1;
	}

	footer button {
		margin: 0;
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		color: var(--automataColor);
		background: transparent;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		cursor: pointer;
	}

	footer .primary {
		color: var(--automataBg);
		background: var(--automataColor);
	}

	footer .primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	footer .danger {
		border-color: var(--automataRed);
		color: var(--automataRed);
	}

	footer button:not(:disabled):hover {
		filter: brightness(1.08);
		background-color: var(--automataBgRGBA);
	}

	footer .primary:not(:disabled):hover {
		background: var(--automataColor);
	}
</style>
