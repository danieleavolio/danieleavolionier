<script lang="ts">
	import '@fontsource/manrope/300.css';
	import '@fontsource/manrope/600.css';
	import { untrack } from 'svelte';
	import {
		coverTemplates,
		defaultCoverSpec,
		loadCoverFonts,
		renderCover,
		type CoverSpec
	} from '#lib/editor/cover-render.ts';

	let {
		open = $bindable(false),
		title = '',
		description = '',
		categories = [],
		mode = 'cover',
		onuse
	}: {
		open?: boolean;
		title?: string;
		description?: string;
		categories?: string[];
		/** 'cover' sets the article cover, 'inline' inserts the image in the text. */
		mode?: 'cover' | 'inline';
		onuse: (file: File) => void | Promise<void>;
	} = $props();

	const id = $props.id();
	let dialog: HTMLDialogElement;
	let canvas: HTMLCanvasElement;
	let spec = $state<CoverSpec>(defaultCoverSpec());
	let busy = $state(false);
	let error = $state('');

	const slug = $derived(
		(spec.title || title)
			.replace(/\*\*/g, '')
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 60)
			.replace(/-+$/, '') || 'copertina'
	);

	// Prefill from the article each time the studio opens.
	$effect(() => {
		if (open && !dialog.open) {
			untrack(() => {
				spec = defaultCoverSpec({ title, description, categories });
				error = '';
				busy = false;
			});
			dialog.showModal();
		} else if (!open && dialog.open) dialog.close();
	});

	let request = 0;
	$effect(() => {
		if (!open) return;
		const snapshot = $state.snapshot(spec);
		const timer = setTimeout(async () => {
			const current = ++request;
			await loadCoverFonts();
			if (current === request && canvas) renderCover(canvas, snapshot);
		}, 100);
		return () => clearTimeout(timer);
	});

	function close() {
		if (busy) return;
		open = false;
	}

	async function use() {
		if (busy) return;
		busy = true;
		error = '';
		try {
			await loadCoverFonts();
			renderCover(canvas, $state.snapshot(spec));
			const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
			if (!blob) throw new Error('Impossibile generare l’immagine.');
			await onuse(
				new File([blob], `${mode === 'cover' ? 'copertina' : 'immagine'}-${slug}.png`, {
					type: 'image/png'
				})
			);
			open = false;
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'Impossibile usare la copertina.';
		} finally {
			busy = false;
		}
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={`${id}-heading`}
	onclose={() => (open = false)}
	oncancel={(event) => busy && event.preventDefault()}
	onkeydown={(event) => event.stopPropagation()}
>
	<header class="studio-header">
		<h2 id={`${id}-heading`}>{mode === 'cover' ? 'Studio copertine' : 'Studio immagini'}</h2>
		<button type="button" onclick={close} disabled={busy}>Annulla</button>
	</header>

	<div class="studio-grid">
		<div class="controls">
			<fieldset>
				<legend>Formato</legend>
				<div class="choices">
					{#each coverTemplates as template (template.value)}
						<label class="choice">
							<input type="radio" bind:group={spec.template} value={template.value} />
							<span>{template.label} <small>{template.size}</small></span>
						</label>
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend>Tema</legend>
				<div class="choices">
					<label class="choice">
						<input type="radio" bind:group={spec.theme} value="chiaro" />
						<span>Chiaro</span>
					</label>
					<label class="choice">
						<input type="radio" bind:group={spec.theme} value="scuro" />
						<span>Scuro</span>
					</label>
				</div>
			</fieldset>

			<label for={`${id}-eyebrow`}>Sopratitolo</label>
			<input id={`${id}-eyebrow`} form="" type="text" bind:value={spec.eyebrow} />

			<label for={`${id}-title`}>Titolo</label>
			<textarea id={`${id}-title`} form="" rows="2" bind:value={spec.title}></textarea>
			<p class="hint">Le parole tra **doppi asterischi** vanno in grassetto.</p>

			<label for={`${id}-subtitle`}>Sottotitolo</label>
			<textarea id={`${id}-subtitle`} form="" rows="2" bind:value={spec.subtitle}></textarea>

			<label for={`${id}-panel-title`}>Titolo del pannello</label>
			<input id={`${id}-panel-title`} form="" type="text" bind:value={spec.panelTitle} />

			<label for={`${id}-panel-text`}>Testo del pannello</label>
			<textarea
				id={`${id}-panel-text`}
				form=""
				class="mono"
				rows="6"
				spellcheck="false"
				bind:value={spec.panelText}
			></textarea>
			<p class="hint">Spazi e a capo restano: va bene anche l’ASCII art.</p>

			<label for={`${id}-bars`}>Barre</label>
			<textarea
				id={`${id}-bars`}
				form=""
				class="mono"
				rows="3"
				spellcheck="false"
				placeholder="etichetta | valore | rosso"
				bind:value={spec.bars}
			></textarea>
			<p class="hint">Una per riga: <code>etichetta | valore</code>, colore facoltativo.</p>

			<label for={`${id}-tags`}>Tag</label>
			<input id={`${id}-tags`} form="" type="text" bind:value={spec.tags} />

			<label for={`${id}-footer`}>Testo in basso a destra</label>
			<input id={`${id}-footer`} form="" type="text" bind:value={spec.footer} />
		</div>

		<section class="studio-preview" aria-label="Anteprima della copertina">
			<h3>Anteprima in tempo reale</h3>
			<canvas
				bind:this={canvas}
				style:aspect-ratio={spec.template === 'quadrato' ? '1 / 1' : '16 / 9'}
				aria-label="Anteprima della copertina"
			></canvas>
		</section>
	</div>

	<footer>
		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}
		<button class="primary" type="button" disabled={busy} onclick={use}>
			{busy
				? 'Carico l’immagine…'
				: mode === 'cover'
					? 'Usa come copertina'
					: 'Inserisci nell’articolo'}
		</button>
	</footer>
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		inline-size: min(76rem, calc(100vw - 1.5rem));
		max-block-size: calc(100dvh - 1.5rem);
		margin: auto;
		padding: 0;
		overflow: hidden;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBg);
	}

	dialog[open] {
		display: flex;
		flex-direction: column;
	}

	dialog::backdrop {
		background: rgb(21 21 18 / 65%);
	}

	.studio-header,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.65rem;
		padding: clamp(0.75rem, 2.5vw, 1.5rem);
	}

	footer {
		justify-content: end;
		border-block-start: 1px solid var(--yr-line-strong);
	}

	.studio-header {
		border-block-end: 1px solid var(--yr-line-strong);
	}

	.studio-header h2,
	.studio-preview h3 {
		margin: 0;
		font-family: var(--font-mono);
	}

	.studio-grid {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
		gap: 1rem;
		padding: clamp(0.75rem, 2.5vw, 1.5rem);
		overflow-y: auto;
	}

	.controls {
		display: grid;
		gap: 0.4rem;
		align-content: start;
		min-inline-size: 0;
	}

	label {
		font-weight: 600;
	}

	fieldset {
		margin: 0;
		padding: 0.4rem 0.6rem 0.5rem;
		border: 1px solid var(--yr-line-strong);
	}

	legend {
		padding-inline: 0.25rem;
		font-weight: 600;
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
	}

	.choice {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 400;
	}

	small {
		opacity: 0.7;
	}

	input[type='text'],
	textarea {
		box-sizing: border-box;
		inline-size: 100%;
		padding: 0.4rem 0.5rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: inherit;
		background: var(--automataBg);
		font: inherit;
		font-size: 0.9rem;
	}

	textarea {
		resize: vertical;
	}

	textarea.mono {
		font-family: var(--font-mono);
		line-height: 1.4;
		tab-size: 2;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
	}

	.hint {
		font-size: 0.8rem;
		opacity: 0.75;
	}

	.studio-preview {
		position: sticky;
		inset-block-start: 0;
		align-self: start;
		display: grid;
		gap: 0.6rem;
		min-inline-size: 0;
		padding: 0.75rem;
		border: 1px solid var(--yr-line-strong);
	}

	canvas {
		display: block;
		inline-size: 100%;
		block-size: auto;
		max-block-size: 70dvh;
		margin-inline: auto;
		object-fit: contain;
		border: 1px solid var(--automataColor);
	}

	.error {
		margin-inline-end: auto;
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--automataRed);
	}

	button {
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		box-shadow: none;
		color: inherit;
		background: var(--automataBg);
	}

	button:disabled {
		opacity: 0.5;
	}

	.primary {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	@media (max-width: 740px) {
		.studio-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.studio-preview {
			position: static;
			order: -1;
		}
	}
</style>
