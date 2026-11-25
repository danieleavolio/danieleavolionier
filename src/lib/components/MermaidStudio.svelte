<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import {
		isMermaidLimitError,
		mountMermaidRender,
		nextMermaidId,
		renderMermaidSource
	} from '#lib/mermaid.ts';

	let {
		initial,
		apply,
		dismiss
	}: {
		initial: string | null;
		apply: (source: string) => void;
		dismiss: () => void;
	} = $props();

	const id = $props.id();
	let dialog: HTMLDialogElement;
	let preview: HTMLDivElement;
	let source = $state(untrack(() => initial ?? ''));
	let rendered = $state('');
	let rendering = $state(false);
	let error = $state<{ summary: string; detail: string } | null>(null);
	let request = 0;

	const templates = [
		{
			label: 'Flusso',
			source:
				'flowchart LR\n  A[Commit] --> B{Test ok?}\n  B -- sì --> C[Deploy]\n  B -- no --> D[Correggi]\n  D --> A'
		},
		{
			label: 'Sequenza',
			source:
				'sequenceDiagram\n  Browser->>Server: GET /pagine\n  Server->>Supabase: query articoli\n  Supabase-->>Server: righe\n  Server-->>Browser: HTML'
		},
		{
			label: 'Stati',
			source:
				'stateDiagram-v2\n  [*] --> Bozza\n  Bozza --> Pubblicato\n  Pubblicato --> Bozza\n  Pubblicato --> [*]'
		}
	];

	// Modulo guidato: solo flowchart. Con un diagramma esistente si parte dal codice.
	const shapes = [
		{ value: 'rect', label: 'Rettangolo', open: '[', close: ']' },
		{ value: 'round', label: 'Arrotondato', open: '(', close: ')' },
		{ value: 'rhombus', label: 'Decisione', open: '{', close: '}' },
		{ value: 'circle', label: 'Cerchio', open: '((', close: '))' }
	];
	type FormNode = { id: number; label: string; shape: string };
	type FormEdge = { id: number; from: number; to: number; label: string };

	let mode = $state<'form' | 'code'>(untrack(() => (initial ? 'code' : 'form')));
	let direction = $state('LR');
	let nodes = $state<FormNode[]>([
		{ id: 1, label: 'Inizio', shape: 'rect' },
		{ id: 2, label: 'Fine', shape: 'rect' }
	]);
	let edges = $state<FormEdge[]>([{ id: 1, from: 1, to: 2, label: '' }]);
	let counter = 2;

	const quote = (text: string) => `"${text.replaceAll('"', '#quot;').replace(/\s*\n\s*/g, ' ')}"`;

	function buildFlowchart(): string {
		const lines = [`flowchart ${direction}`];
		for (const node of nodes) {
			const shape = shapes.find((s) => s.value === node.shape) ?? shapes[0];
			lines.push(
				`  n${node.id}${shape.open}${quote(node.label.trim() || `Nodo ${node.id}`)}${shape.close}`
			);
		}
		for (const edge of edges) {
			if (!nodes.some((n) => n.id === edge.from) || !nodes.some((n) => n.id === edge.to)) continue;
			const label = edge.label.trim();
			lines.push(`  n${edge.from} -->${label ? `|${quote(label)}|` : ''} n${edge.to}`);
		}
		return lines.join('\n');
	}

	function addNode() {
		nodes.push({ id: ++counter, label: '', shape: 'rect' });
	}

	function removeNode(id: number) {
		nodes = nodes.filter((n) => n.id !== id);
		edges = edges.filter((e) => e.from !== id && e.to !== id);
	}

	function addEdge() {
		if (nodes.length < 2) return;
		const last = nodes.at(-1)!;
		const prev = nodes.at(-2)!;
		edges.push({ id: Date.now(), from: prev.id, to: last.id, label: '' });
	}

	$effect(() => {
		if (mode === 'form') source = buildFlowchart();
	});

	const trimmed = $derived(source.trim());
	const valid = $derived(Boolean(trimmed) && rendered === trimmed && !rendering && !error);

	function explain(cause: unknown, text: string): { summary: string; detail: string } {
		if (isMermaidLimitError(cause)) {
			return {
				summary: 'Il diagramma è troppo grande o complesso per essere disegnato.',
				detail: 'Dividilo in due diagrammi o riduci nodi e collegamenti.'
			};
		}
		const detail = cause instanceof Error ? cause.message : String(cause);
		const reported = Number(detail.match(/on line (\d+)/i)?.[1]);
		if (reported) {
			// Mermaid counts the end of an unfinished last line as one more line.
			const line = Math.min(reported, text.split('\n').length);
			return { summary: `Errore di sintassi alla riga ${line}.`, detail };
		}
		if (/no diagram type detected/i.test(detail)) {
			return {
				summary: 'Tipo di diagramma non riconosciuto.',
				detail:
					'La prima riga deve dire che diagramma è: flowchart, sequenceDiagram, stateDiagram-v2, classDiagram, gantt…'
			};
		}
		return { summary: 'Il diagramma non si può disegnare.', detail };
	}

	async function render(text: string) {
		const current = ++request;
		rendering = true;
		try {
			await document.fonts?.ready;
			const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
			const result = await renderMermaidSource(
				text,
				nextMermaidId(),
				preview.clientWidth - 2 * rem - 2
			);
			if (current !== request) return;
			mountMermaidRender(preview, result);
			rendered = text;
			error = null;
		} catch (cause) {
			if (current !== request) return;
			rendered = '';
			error = explain(cause, text);
		} finally {
			if (current === request) rendering = false;
		}
	}

	$effect(() => {
		const text = trimmed;
		if (!text) {
			request++;
			rendering = false;
			rendered = '';
			error = null;
			return;
		}
		const timer = setTimeout(() => void render(text), 300);
		return () => clearTimeout(timer);
	});

	onMount(() => dialog.showModal());

	function commit() {
		if (!valid) return;
		apply(trimmed);
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={`${id}-heading`}
	onclose={dismiss}
	onkeydown={(event) => event.stopPropagation()}
>
	<header class="studio-header">
		<h2 id={`${id}-heading`}>Studio Mermaid</h2>
		<button type="button" onclick={() => dialog.close()}>Annulla</button>
	</header>

	<div class="studio-grid">
		<div class="controls">
			<div class="modes" role="group" aria-label="Modalità di modifica">
				<button type="button" aria-pressed={mode === 'form'} onclick={() => (mode = 'form')}
					>Guidato</button
				>
				<button type="button" aria-pressed={mode === 'code'} onclick={() => (mode = 'code')}
					>Codice</button
				>
			</div>
			{#if mode === 'form'}
				<p>Flowchart: aggiungi i nodi e collegali. Il codice si genera da solo.</p>
				<label for={`${id}-direction`}>Direzione</label>
				<select id={`${id}-direction`} bind:value={direction}>
					<option value="LR">Da sinistra a destra</option>
					<option value="TD">Dall’alto in basso</option>
				</select>

				<fieldset>
					<legend>Nodi</legend>
					{#each nodes as node, index (node.id)}
						<div class="row">
							<input
								type="text"
								aria-label={`Testo del nodo ${index + 1}`}
								placeholder={`Nodo ${index + 1}`}
								bind:value={node.label}
							/>
							<select aria-label={`Forma del nodo ${index + 1}`} bind:value={node.shape}>
								{#each shapes as shape (shape.value)}
									<option value={shape.value}>{shape.label}</option>
								{/each}
							</select>
							<button
								type="button"
								aria-label={`Rimuovi il nodo ${index + 1}`}
								disabled={nodes.length <= 2}
								onclick={() => removeNode(node.id)}>✕</button
							>
						</div>
					{/each}
					<button type="button" onclick={addNode}>+ Nodo</button>
				</fieldset>

				<fieldset>
					<legend>Collegamenti</legend>
					{#each edges as edge, index (edge.id)}
						<div class="row">
							<select aria-label={`Da, collegamento ${index + 1}`} bind:value={edge.from}>
								{#each nodes as node, i (node.id)}
									<option value={node.id}>{node.label.trim() || `Nodo ${i + 1}`}</option>
								{/each}
							</select>
							<span aria-hidden="true">→</span>
							<select aria-label={`A, collegamento ${index + 1}`} bind:value={edge.to}>
								{#each nodes as node, i (node.id)}
									<option value={node.id}>{node.label.trim() || `Nodo ${i + 1}`}</option>
								{/each}
							</select>
							<input
								type="text"
								aria-label={`Etichetta del collegamento ${index + 1}`}
								placeholder="Etichetta (facoltativa)"
								bind:value={edge.label}
							/>
							<button
								type="button"
								aria-label={`Rimuovi il collegamento ${index + 1}`}
								onclick={() => (edges = edges.filter((e) => e.id !== edge.id))}>✕</button
							>
						</div>
					{/each}
					<button type="button" onclick={addEdge}>+ Collegamento</button>
				</fieldset>
			{:else}
				<label for={`${id}-source`}>Codice del diagramma</label>
				<textarea
					id={`${id}-source`}
					form=""
					bind:value={source}
					spellcheck="false"
					autocapitalize="off"
					rows="16"
					placeholder="flowchart LR&#10;  A --> B"
				></textarea>
				{#if !trimmed}
					<div class="templates" role="group" aria-label="Parti da un modello">
						<span>Parti da un modello:</span>
						{#each templates as template (template.label)}
							<button type="button" onclick={() => (source = template.source)}
								>{template.label}</button
							>
						{/each}
					</div>
				{/if}
				<p>
					La prima riga indica il tipo di diagramma. Tornando a «Guidato» il codice viene rigenerato
					dal modulo.
					<a
						href="https://mermaid.js.org/intro/syntax-reference.html"
						target="_blank"
						rel="noopener">Sintassi Mermaid</a
					>
				</p>
			{/if}
		</div>

		<section class="studio-preview" aria-label="Anteprima del diagramma">
			<h3>Anteprima in tempo reale</h3>
			<p class="status" role="status">
				{#if !trimmed}
					Scrivi il codice per vedere il diagramma.
				{:else if rendering}
					Disegno in corso…
				{:else if error}
					{error.summary}
				{:else if valid}
					Diagramma valido.
				{/if}
			</p>
			{#if error}
				<pre class="error-detail">{error.detail}</pre>
			{/if}
			<div
				class="rich-mermaid"
				class:stale={Boolean(error) || rendering}
				hidden={!trimmed}
				bind:this={preview}
			></div>
		</section>
	</div>

	<footer>
		<button class="primary" type="button" disabled={!valid} onclick={commit}>
			{initial ? 'Aggiorna diagramma' : 'Inserisci diagramma'}
		</button>
	</footer>
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		inline-size: min(72rem, calc(100vw - 1.5rem));
		max-block-size: calc(100dvh - 1.5rem);
		margin: auto;
		padding: clamp(0.75rem, 2.5vw, 1.5rem);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBg);
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
		margin-block: 1rem;
	}

	.controls {
		display: grid;
		gap: 0.5rem;
		align-content: start;
		min-inline-size: 0;
	}

	label {
		font-weight: 600;
	}

	textarea {
		box-sizing: border-box;
		inline-size: 100%;
		min-block-size: 18rem;
		padding: 0.5rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: inherit;
		background: var(--automataBg);
		font-family: var(--font-mono);
		font-size: 0.9rem;
		line-height: 1.5;
		tab-size: 2;
		resize: vertical;
	}

	.modes {
		display: flex;
		gap: 0.4rem;
	}

	.modes button[aria-pressed='true'] {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	fieldset {
		display: grid;
		gap: 0.4rem;
		min-inline-size: 0;
		margin: 0;
		padding: 0.5rem;
		border: 1px solid var(--yr-line-strong);
	}

	fieldset > button {
		justify-self: start;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}

	.row input[type='text'] {
		flex: 1 1 8rem;
		min-inline-size: 0;
	}

	input[type='text'],
	select {
		box-sizing: border-box;
		padding: 0.3rem 0.4rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: inherit;
		background: var(--automataBg);
		font: inherit;
		font-size: 0.9rem;
	}

	.templates {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9rem;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
	}

	.controls a {
		padding: 0 0.15rem;
		letter-spacing: normal;
		text-decoration: underline;
		text-shadow: none;
		text-transform: none;
		background: none;
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

	.error-detail {
		max-block-size: 8rem;
		margin: 0;
		padding: 0.5rem;
		overflow: auto;
		border: 1px solid var(--automataRed);
		white-space: pre-wrap;
		font-size: 0.8rem;
	}

	.rich-mermaid {
		display: flex;
		justify-content: center;
		padding: 1rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		overflow-x: auto;
	}

	.rich-mermaid.stale {
		opacity: 0.45;
	}

	.rich-mermaid :global(svg) {
		max-width: 100%;
		height: auto;
		font-family: var(--font-mono);
	}

	.studio-preview :global(.rich-mermaid[data-renderer='pele']) {
		--pele-bg: var(--automataBg);
		--pele-fg: var(--automataColor);
		--pele-muted: var(--automataColor);
		--pele-line: var(--yr-accent);
		--pele-surface: var(--automataBgRGBA);
		--pele-surface-alt: var(--automataBgRGBA);
		--pele-border: var(--yr-accent);
		--pele-accent: var(--automataRed);
		--pele-radius: 0px;
	}

	.rich-mermaid :global(svg.pele-flowchart) {
		fill: var(--pele-fg);
	}

	button {
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		box-shadow: none;
		color: inherit;
		background: var(--automataBg);
	}

	footer {
		justify-content: end;
	}

	.primary {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.primary:disabled {
		opacity: 0.5;
	}

	@media (max-width: 740px) {
		.studio-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.studio-preview {
			position: static;
		}
		textarea {
			min-block-size: 12rem;
		}
	}
</style>
