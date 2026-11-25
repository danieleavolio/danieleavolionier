<script lang="ts">
	import '@fontsource/manrope/300.css';
	import '@fontsource/manrope/600.css';
	import { untrack } from 'svelte';
	import CoverIconPicker from '#lib/components/CoverIconPicker.svelte';
	import CoverColorPicker from '#lib/components/CoverColorPicker.svelte';
	import { embedCoverSpec } from '#lib/editor/cover-meta.ts';
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
		initialSpec = null,
		onuse
	}: {
		/** Settings read from an existing studio cover, to edit it instead of starting over. */
		initialSpec?: CoverSpec | null;
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
				spec = initialSpec
					? { ...defaultCoverSpec(), ...structuredClone($state.snapshot(initialSpec)) }
					: defaultCoverSpec({ title, description, categories });
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
			const png = mode === 'cover' ? await embedCoverSpec(blob, $state.snapshot(spec)) : blob;
			await onuse(
				new File([png], `${mode === 'cover' ? 'copertina' : 'immagine'}-${slug}.png`, {
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

			<fieldset>
				<legend>Flusso (icone e frecce)</legend>
				<p class="hint">
					Per una copertina solo con il flusso, lascia vuoti sopratitolo, titolo e sottotitolo.
				</p>
				{#each spec.flow as step, i (i)}
					<div class="row">
						<CoverIconPicker bind:value={step.kind} color={step.color} theme={spec.theme} />
						<input
							form=""
							type="text"
							aria-label="Etichetta"
							placeholder="Etichetta"
							bind:value={step.label}
						/>
						<CoverColorPicker bind:value={step.color} theme={spec.theme} />
						<button
							type="button"
							aria-label="Rimuovi passaggio"
							onclick={() => spec.flow.splice(i, 1)}
						>
							×
						</button>
					</div>
				{/each}
				<button
					type="button"
					onclick={() => spec.flow.push({ label: '', kind: 'box', color: 'ink' })}
				>
					+ Passaggio
				</button>
			</fieldset>

			<fieldset>
				<legend>Barre</legend>
				{#each spec.bars as bar, i (i)}
					<div class="row">
						<input
							form=""
							type="text"
							aria-label="Etichetta"
							placeholder="Etichetta"
							bind:value={bar.label}
						/>
						<input
							form=""
							type="text"
							inputmode="decimal"
							class="short"
							aria-label="Valore"
							placeholder="Valore"
							bind:value={bar.value}
						/>
						<CoverColorPicker bind:value={bar.color} theme={spec.theme} />
						<button type="button" aria-label="Rimuovi barra" onclick={() => spec.bars.splice(i, 1)}>
							×
						</button>
					</div>
				{/each}
				<button
					type="button"
					onclick={() => spec.bars.push({ label: '', value: '', color: 'ink' })}
				>
					+ Barra
				</button>
			</fieldset>

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

	fieldset:has(.row) {
		display: grid;
		gap: 0.4rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.row input[type='text'] {
		flex: 1 1 0;
		min-inline-size: 0;
	}

	.row input.short {
		flex: 0 0 5rem;
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
