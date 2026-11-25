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
	let controlsPane: HTMLDivElement;
	let previewPane: HTMLElement;
	let lock: HTMLElement | null = null;

	// I due riquadri scorrono in modo indipendente e si allineano in proporzione.
	function sync(from: HTMLElement, to: HTMLElement) {
		if (lock === from) {
			lock = null;
			return;
		}
		const max = from.scrollHeight - from.clientHeight;
		const toMax = to.scrollHeight - to.clientHeight;
		if (max <= 0 || toMax <= 0) return;
		const target = (from.scrollTop / max) * toMax;
		if (Math.abs(to.scrollTop - target) < 1) return;
		lock = to;
		to.scrollTop = target;
	}
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

	// Modulo guidato: flowchart e diagrammi di sequenza. Un diagramma esistente viene letto nel modulo.
	const shapes = [
		{ value: 'rect', label: 'Rettangolo', open: '[', close: ']' },
		{ value: 'round', label: 'Arrotondato', open: '(', close: ')' },
		{ value: 'rhombus', label: 'Decisione', open: '{', close: '}' },
		{ value: 'circle', label: 'Cerchio', open: '((', close: '))' }
	];
	const arrows = ['->>', '-->>', '->', '-->', '-x', '--x', '-)', '--)'];
	const positions = ['right of', 'left of', 'over'];
	type FormNode = { id: number; label: string; shape: string };
	type FormEdge = { id: number; from: number; to: number; label: string };
	type Participant = { id: number; key: string; name: string };
	type Step = {
		id: number;
		kind: 'msg' | 'note' | 'raw';
		a: string;
		arrow: string;
		b: string;
		text: string;
	};
	type FormKind = 'flowchart' | 'sequence' | null;

	let mode = $state<'form' | 'code'>(untrack(() => (initial ? 'code' : 'form')));
	let formKind = $state<FormKind>('flowchart');
	let participants = $state<Participant[]>([]);
	let steps = $state<Step[]>([]);
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

	const unquote = (text: string) =>
		text
			.trim()
			.replace(/^"(.*)"$/s, '$1')
			.replaceAll('#quot;', '"');

	function buildSequence(): string {
		const lines = ['sequenceDiagram'];
		for (const p of participants) {
			const key = p.key.trim();
			if (!key) continue;
			const name = p.name.trim();
			lines.push(`    participant ${key}${name && name !== key ? ` as ${name}` : ''}`);
		}
		for (const s of steps) {
			if (s.kind === 'raw') {
				if (s.text.trim()) lines.push(`    ${s.text.trim()}`);
			} else if (s.kind === 'note') {
				lines.push(`    Note ${s.arrow} ${s.a.trim()}: ${s.text}`);
			} else {
				lines.push(`    ${s.a.trim()}${s.arrow}${s.b.trim()}: ${s.text}`);
			}
		}
		return lines.join('\n');
	}

	function parseFlowchart(text: string): boolean {
		const lines = text
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l && !l.startsWith('%%'));
		const head = lines.shift()?.match(/^(?:flowchart|graph)\s+(LR|RL|TD|TB|BT)\s*;?$/i);
		if (!head) return false;
		const ids = new Map<string, FormNode>();
		const nextNodes: FormNode[] = [];
		const nextEdges: FormEdge[] = [];
		let n = 0;
		const nodeRe = /^([A-Za-z_]\w*)(?:(\(\(|\[|\(|\{)("[^"]*"|[^\])}"]*?)(\)\)|\]|\)|\}))?/;
		const edgeRes = [/^\s*--\s+(.+?)\s+-->\s*/, /^\s*-->\|([^|]*)\|\s*/, /^\s*-->\s*/];
		const take = (rest: string): [FormNode, string] | null => {
			const m = rest.match(nodeRe);
			if (!m) return null;
			const shape = m[2] ? shapes.find((s) => s.open === m[2] && s.close === m[4]) : undefined;
			if (m[2] && !shape) return null;
			let node = ids.get(m[1]);
			if (!node) {
				node = { id: ++n, label: m[1], shape: 'rect' };
				ids.set(m[1], node);
				nextNodes.push(node);
			}
			if (shape) {
				node.label = unquote(m[3]);
				node.shape = shape.value;
			}
			return [node, rest.slice(m[0].length)];
		};
		for (const line of lines) {
			const first = take(line.replace(/;$/, ''));
			if (!first) return false;
			let [prev, rest] = first;
			while (rest.trim()) {
				const hit = edgeRes.map((re) => rest.match(re)).find(Boolean);
				if (!hit) return false;
				const next = take(rest.slice(hit[0].length));
				if (!next) return false;
				nextEdges.push({
					id: ++n + 1000,
					from: prev.id,
					to: next[0].id,
					label: hit[1] ? unquote(hit[1]) : ''
				});
				[prev, rest] = next;
			}
		}
		if (!nextNodes.length) return false;
		const dir = head[1].toUpperCase();
		direction = dir === 'TB' ? 'TD' : dir;
		nodes = nextNodes;
		edges = nextEdges;
		counter = n + 1000;
		return true;
	}

	function parseSequence(text: string): boolean {
		const lines = text
			.split('\n')
			.map((l) => l.trim())
			.filter((l) => l && !l.startsWith('%%'));
		if (lines.shift() !== 'sequenceDiagram') return false;
		const nextP: Participant[] = [];
		const nextS: Step[] = [];
		let n = 0;
		const ensure = (key: string, name = '') => {
			let p = nextP.find((x) => x.key === key);
			if (!p) nextP.push((p = { id: ++n, key, name: '' }));
			if (name) p.name = name;
		};
		for (const line of lines) {
			let m = line.match(/^(?:participant|actor)\s+(\S+?)(?:\s+as\s+(.+))?$/);
			if (m) {
				ensure(m[1], m[2]?.trim());
				continue;
			}
			m = line.match(/^note\s+(right of|left of|over)\s+([^:]+?)\s*:\s*(.*)$/i);
			if (m) {
				m[2].split(',').forEach((k) => ensure(k.trim()));
				nextS.push({
					id: ++n,
					kind: 'note',
					a: m[2],
					arrow: m[1].toLowerCase(),
					b: '',
					text: m[3]
				});
				continue;
			}
			m = line.match(/^([^\s:>-]+?)\s*(-->>|->>|--x|-x|--\)|-\)|-->|->)\s*([^\s:]+?)\s*:\s*(.*)$/);
			if (m) {
				ensure(m[1]);
				ensure(m[3]);
				nextS.push({ id: ++n, kind: 'msg', a: m[1], arrow: m[2], b: m[3], text: m[4] });
				continue;
			}
			nextS.push({ id: ++n, kind: 'raw', a: '', arrow: '', b: '', text: line });
		}
		participants = nextP;
		steps = nextS;
		counter = n;
		return true;
	}

	const detectKind = (text: string): FormKind =>
		/^\s*(?:flowchart|graph)\b/i.test(text)
			? 'flowchart'
			: /^\s*sequenceDiagram\b/.test(text)
				? 'sequence'
				: null;

	const build = () => (formKind === 'sequence' ? buildSequence() : buildFlowchart());

	function addParticipant() {
		participants.push({ id: ++counter, key: `P${participants.length + 1}`, name: '' });
	}

	function addStep(kind: 'msg' | 'note') {
		const first = participants[0]?.key ?? '';
		const second = participants[1]?.key ?? first;
		steps.push(
			kind === 'msg'
				? { id: ++counter, kind, a: first, arrow: '->>', b: second, text: '' }
				: { id: ++counter, kind, a: first, arrow: 'right of', b: '', text: '' }
		);
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

	// Il modulo riscrive il codice solo se è partito da vuoto, dal suo output o da un diagramma che ha saputo leggere.
	let adopted = $state(untrack(() => !initial));
	let generated = '';

	$effect(() => {
		if (mode === 'form' && adopted && formKind) {
			source = build();
			generated = source.trim();
		}
	});

	function openForm() {
		const current = source.trim();
		mode = 'form';
		if (!current || current === generated) {
			adopted = true;
			return;
		}
		const kind = detectKind(current);
		const ok =
			kind === 'flowchart'
				? parseFlowchart(current)
				: kind === 'sequence' && parseSequence(current);
		formKind = ok ? kind : null;
		adopted = ok;
	}

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
		<div class="controls" bind:this={controlsPane} onscroll={() => sync(controlsPane, previewPane)}>
			<div class="modes" role="group" aria-label="Modalità di modifica">
				<button type="button" aria-pressed={mode === 'form'} onclick={openForm}>Guidato</button>
				<button type="button" aria-pressed={mode === 'code'} onclick={() => (mode = 'code')}
					>Codice</button
				>
			</div>
			{#if mode === 'form' && formKind === 'flowchart'}
				<p>Flowchart: aggiungi i nodi e collegali. Il codice si genera da solo.</p>
				<label for={`${id}-direction`}>Direzione</label>
				<select id={`${id}-direction`} bind:value={direction}>
					<option value="LR">Da sinistra a destra</option>
					<option value="TD">Dall’alto in basso</option>
					<option value="RL">Da destra a sinistra</option>
					<option value="BT">Dal basso in alto</option>
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
			{:else if mode === 'form' && formKind === 'sequence'}
				<p>Diagramma di sequenza: partecipanti e passaggi, nell’ordine in cui compaiono.</p>
				<fieldset>
					<legend>Partecipanti</legend>
					{#each participants as p, index (p.id)}
						<div class="row">
							<input
								class="short"
								type="text"
								aria-label={`Sigla del partecipante ${index + 1}`}
								bind:value={p.key}
							/>
							<input
								type="text"
								aria-label={`Nome del partecipante ${index + 1}`}
								placeholder="Nome (facoltativo)"
								bind:value={p.name}
							/>
							<button
								type="button"
								aria-label={`Rimuovi il partecipante ${index + 1}`}
								onclick={() => (participants = participants.filter((x) => x.id !== p.id))}>✕</button
							>
						</div>
					{/each}
					<button type="button" onclick={addParticipant}>+ Partecipante</button>
				</fieldset>
				<fieldset>
					<legend>Passaggi</legend>
					{#each steps as step, index (step.id)}
						<div class="row">
							{#if step.kind === 'msg'}
								<input
									class="short"
									type="text"
									aria-label={`Da, passaggio ${index + 1}`}
									bind:value={step.a}
								/>
								<select aria-label={`Freccia, passaggio ${index + 1}`} bind:value={step.arrow}>
									{#each arrows as arrow (arrow)}<option value={arrow}>{arrow}</option>{/each}
								</select>
								<input
									class="short"
									type="text"
									aria-label={`A, passaggio ${index + 1}`}
									bind:value={step.b}
								/>
							{:else if step.kind === 'note'}
								<span>Nota</span>
								<select aria-label={`Posizione, passaggio ${index + 1}`} bind:value={step.arrow}>
									{#each positions as position (position)}<option value={position}
											>{position}</option
										>{/each}
								</select>
								<input
									class="short"
									type="text"
									aria-label={`Partecipante, passaggio ${index + 1}`}
									bind:value={step.a}
								/>
							{/if}
							<input
								type="text"
								aria-label={`Testo, passaggio ${index + 1}`}
								bind:value={step.text}
							/>
							<button
								type="button"
								aria-label={`Rimuovi il passaggio ${index + 1}`}
								onclick={() => (steps = steps.filter((x) => x.id !== step.id))}>✕</button
							>
						</div>
					{/each}
					<div class="row">
						<button type="button" onclick={() => addStep('msg')}>+ Messaggio</button>
						<button type="button" onclick={() => addStep('note')}>+ Nota</button>
					</div>
				</fieldset>
			{:else if mode === 'form'}
				<p>
					Il modulo guidato legge solo flowchart e diagrammi di sequenza. Per questo diagramma usa
					«Codice».
				</p>
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

		<section
			class="studio-preview"
			aria-label="Anteprima del diagramma"
			bind:this={previewPane}
			onscroll={() => sync(previewPane, controlsPane)}
		>
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

	dialog[open] {
		display: flex;
		flex-direction: column;
		block-size: calc(100dvh - 1.5rem);
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
		grid-template-rows: minmax(0, 1fr);
		gap: 1rem;
		flex: 1 1 auto;
		min-block-size: 0;
		margin-block: 1rem;
	}

	.controls {
		display: grid;
		gap: 0.5rem;
		align-content: start;
		min-inline-size: 0;
		min-block-size: 0;
		max-block-size: 100%;
		overflow-y: auto;
		padding-inline-end: 0.25rem;
	}

	.row input.short {
		flex: 0 1 5rem;
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
		align-content: start;
		min-block-size: 0;
		max-block-size: 100%;
		overflow-y: auto;
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

	.rich-mermaid :global(svg.pele) {
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
		dialog[open] {
			display: block;
			block-size: auto;
			overflow-y: auto;
		}
		.controls,
		.studio-preview {
			max-block-size: none;
			overflow: visible;
		}
		textarea {
			min-block-size: 12rem;
		}
	}
</style>
