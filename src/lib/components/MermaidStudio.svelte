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
				La prima riga indica il tipo di diagramma.
				<a href="https://mermaid.js.org/intro/syntax-reference.html" target="_blank" rel="noopener"
					>Sintassi Mermaid</a
				>
			</p>
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
