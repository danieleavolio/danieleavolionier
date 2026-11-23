<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Editor, type Range } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
	import {
		codeBlockEditButtons,
		createRichExtensions,
		slashMenu,
		type CalloutTone,
		type SlashItem
	} from '#lib/editor/extensions.ts';
	import { findImageFiles, uploadImage } from '#lib/media.ts';
	import { parseChart, type ChartSettings } from '#lib/bar-chart.ts';
	import { isGalleryUrl } from '#lib/rich-gallery.ts';
	import type { RichTextDocument } from '#lib/types.ts';
	import ChartStudio from '#lib/components/ChartStudio.svelte';
	import MermaidStudio from '#lib/components/MermaidStudio.svelte';

	export let html = '';
	export let json: RichTextDocument | null = null;
	export let placeholder = 'Scrivi il contenuto…';

	const dispatch = createEventDispatcher<{ change: { html: string; json: RichTextDocument } }>();
	let editorElement: HTMLDivElement;
	let editor: Editor | null = null;
	let pendingUploads = 0;
	type BlockTarget = number | { from: number; to: number };
	let chartStudio: { initial: ChartSettings | null; at: BlockTarget } | null = null;
	let mermaidStudio: { initial: string | null; at: BlockTarget } | null = null;

	function emitChange() {
		if (!editor) return;
		html = editor.getHTML();
		json = editor.getJSON() as RichTextDocument;
		dispatch('change', { html, json });
	}

	/**
	 * Uploads every image file dropped or pasted into the editor to the
	 * `post-images` Supabase bucket and inserts the returned public URLs as
	 * each upload completes. Returns true when the editor must not fall back
	 * to the default ProseMirror handling.
	 */
	async function uploadAndInsertFiles(files: File[]): Promise<boolean> {
		if (!editor || files.length === 0) return false;
		pendingUploads += files.length;
		let applied = false;
		try {
			for (const file of files) {
				const { url } = await uploadImage(file);
				applied = true;
				editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
				emitChange();
			}
		} catch (cause) {
			console.error('Image upload failed:', cause);
			setTimeout(() => {
				alert(cause instanceof Error ? cause.message : 'Caricamento non riuscito.');
			}, 0);
		} finally {
			pendingUploads -= files.length;
		}
		return applied;
	}

	const MARKDOWN_PATTERN =
		/(^|\n)\s{0,3}(#{1,6}\s|```|~~~|[-*+]\s|\d+\.\s|>\s)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__/;

	function looksLikeMarkdown(text: string): boolean {
		return text.length > 1 && MARKDOWN_PATTERN.test(text);
	}

	async function insertMarkdown(source: string): Promise<void> {
		if (!editor) return;
		const { marked } = await import('marked');
		const rendered = marked.parse(source, { async: false }) as string;
		editor.chain().focus().insertContent(rendered).run();
		emitChange();
	}

	const mediaEditorProps = {
		handleDrop: (_view: unknown, event: DragEvent, _slice: unknown, moved: boolean) => {
			if (moved) return false;
			const files = findImageFiles(event.dataTransfer);
			if (files.length === 0) return false;
			event.preventDefault();
			void uploadAndInsertFiles(files);
			return true;
		},
		handlePaste: (_view: unknown, event: ClipboardEvent) => {
			const files = findImageFiles(event.clipboardData);
			if (files.length > 0) {
				event.preventDefault();
				void uploadAndInsertFiles(files);
				return true;
			}

			// Pasted markdown arrives as plain text: convert it so headings,
			// lists, code fences and diagrams become real rich blocks instead of
			// literal `##` and backtick text.
			const transfer = event.clipboardData;
			if (!transfer || transfer.getData('text/html')) return false;
			const text = transfer.getData('text/plain');
			if (!looksLikeMarkdown(text)) return false;
			event.preventDefault();
			void insertMarkdown(text);
			return true;
		}
	};

	function promptForUrl(message: string): string | null {
		const value = window.prompt(message, 'https://');
		return value?.trim() || null;
	}

	function openChartStudio() {
		if (!editor) return;
		const { $from, $to } = editor.state.selection;
		const block = $from.parent;
		if (block.type.name !== 'codeBlock') {
			chartStudio = { initial: null, at: $from.pos };
			return;
		}
		const initial =
			block === $to.parent && block.attrs.language === 'bar-chart'
				? parseChart(block.textContent)
				: null;
		chartStudio = {
			initial,
			at: initial ? { from: $from.before(), to: $from.after() } : $from.after()
		};
	}

	function insertCodeBlock(at: BlockTarget, language: string, source: string) {
		editor
			?.chain()
			.focus()
			.insertContentAt(at, {
				type: 'codeBlock',
				attrs: { language },
				content: [{ type: 'text', text: source }]
			})
			.run();
	}

	function applyChart(source: string) {
		if (chartStudio) insertCodeBlock(chartStudio.at, 'bar-chart', source);
	}

	function openMermaidStudio() {
		if (!editor) return;
		const { $from, $to } = editor.state.selection;
		const block = $from.parent;
		if (block.type.name !== 'codeBlock') {
			mermaidStudio = { initial: null, at: $from.pos };
		} else if (block === $to.parent && block.attrs.language === 'mermaid') {
			mermaidStudio = {
				initial: block.textContent,
				at: { from: $from.before(), to: $from.after() }
			};
		} else {
			mermaidStudio = { initial: null, at: $from.after() };
		}
	}

	function applyMermaid(source: string) {
		if (mermaidStudio) insertCodeBlock(mermaidStudio.at, 'mermaid', source);
	}

	function editDiagramAt(position: number) {
		const node = editor?.state.doc.nodeAt(position);
		if (node?.type.name !== 'codeBlock' || node.attrs.language !== 'mermaid') return;
		mermaidStudio = {
			initial: node.textContent,
			at: { from: position, to: position + node.nodeSize }
		};
	}

	function editChartAt(position: number) {
		const node = editor?.state.doc.nodeAt(position);
		if (node?.type.name !== 'codeBlock' || node.attrs.language !== 'bar-chart') return;
		const initial = parseChart(node.textContent);
		if (initial) chartStudio = { initial, at: { from: position, to: position + node.nodeSize } };
	}

	const insertTable = () =>
		editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

	const TONE_LABELS: Record<CalloutTone, string> = {
		info: 'Nota',
		warning: 'Attenzione',
		tip: 'Consiglio'
	};

	const slashItems: SlashItem[] = [
		{
			title: 'Titolo 2',
			hint: 'Sezione principale',
			keywords: 'h2 heading titolo',
			run: (e, range) => e.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
		},
		{
			title: 'Titolo 3',
			hint: 'Sottosezione',
			keywords: 'h3 heading titolo',
			run: (e, range) => e.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
		},
		{
			title: 'Lista',
			hint: 'Elenco puntato',
			keywords: 'bullet elenco',
			run: (e, range) => e.chain().focus().deleteRange(range).toggleBulletList().run()
		},
		{
			title: 'Lista numerata',
			hint: 'Elenco con numeri',
			keywords: 'ordered numeri',
			run: (e, range) => e.chain().focus().deleteRange(range).toggleOrderedList().run()
		},
		{
			title: 'Citazione',
			hint: 'Blocco di citazione',
			keywords: 'quote blockquote',
			run: (e, range) => e.chain().focus().deleteRange(range).toggleBlockquote().run()
		},
		...(Object.keys(TONE_LABELS) as CalloutTone[]).map((tone) => ({
			title: `Box: ${TONE_LABELS[tone].toLowerCase()}`,
			hint: 'Riquadro evidenziato',
			keywords: `callout nota box ${tone}`,
			run: (e: Editor, range: Range) =>
				e.chain().focus().deleteRange(range).wrapIn('callout', { tone }).run()
		})),
		{
			title: 'Tabella',
			hint: '3 righe per 3 colonne',
			keywords: 'table righe colonne',
			run: (e, range) =>
				e
					.chain()
					.focus()
					.deleteRange(range)
					.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
					.run()
		},
		{
			title: 'Codice',
			hint: 'Blocco di codice',
			keywords: 'code pre',
			run: (e, range) => e.chain().focus().deleteRange(range).toggleCodeBlock().run()
		},
		{
			title: 'Divisore',
			hint: 'Linea orizzontale',
			keywords: 'hr separatore linea',
			run: (e, range) => e.chain().focus().deleteRange(range).setHorizontalRule().run()
		},
		{
			title: 'Diagramma Mermaid',
			hint: 'Apre lo Studio Mermaid',
			keywords: 'mermaid grafico flusso diagramma',
			run: (e, range) => {
				e.chain().focus().deleteRange(range).run();
				openMermaidStudio();
			}
		},
		{
			title: 'Grafico a barre',
			hint: 'Apre lo Studio grafici',
			keywords: 'chart barre grafico',
			run: (e, range) => {
				e.chain().focus().deleteRange(range).run();
				openChartStudio();
			}
		}
	];

	function insertBlock(kind: string) {
		if (!editor) return;
		const src = promptForUrl(
			kind === 'gallery'
				? 'Incolla gli URL delle immagini o dei video, separati da uno spazio'
				: 'Inserisci l’URL del contenuto'
		);
		if (!src) return;

		if (kind === 'gallery') {
			const images = src.split(/\s+/).filter(isGalleryUrl);
			if (!images.length) return;
			editor
				.chain()
				.focus()
				.insertContent({
					type: 'richBlock',
					attrs: {
						kind,
						images
					}
				})
				.run();
		} else {
			editor.chain().focus().insertContent({ type: 'richBlock', attrs: { kind, src } }).run();
		}
		emitChange();
	}

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				// Link e Underline sono configurati sotto: niente doppioni da StarterKit v3.
				StarterKit.configure({ link: false, underline: false }),
				Underline,
				Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
				Image.configure({ allowBase64: false }),
				Placeholder.configure({ placeholder }),
				Table.configure({ resizable: false }),
				TableRow,
				TableHeader,
				TableCell,
				...createRichExtensions(),
				slashMenu(() => slashItems),
				codeBlockEditButtons([
					{
						language: 'bar-chart',
						label: 'Modifica grafico',
						accepts: (source) => Boolean(parseChart(source)),
						open: editChartAt
					},
					{
						language: 'mermaid',
						label: 'Modifica diagramma',
						accepts: (source) => source.trim().length > 0,
						open: editDiagramAt
					}
				])
			],
			content: json ?? html ?? '',
			editorProps: mediaEditorProps,
			onUpdate: emitChange
		});
	});

	onDestroy(() => editor?.destroy());
	$: if (editor && (html || json) && editor.getHTML() !== html) {
		if (!editor.isFocused) {
			editor.commands.setContent(json ?? html ?? '', { emitUpdate: false });
		}
	}
</script>

<div class="editor-frame">
	{#if editor}
		<div class="toolbar" role="group" aria-label="Strumenti di formattazione">
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleBold().run()}
				class:active={editor.isActive('bold')}>B</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleItalic().run()}
				class:active={editor.isActive('italic')}>I</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleUnderline().run()}
				class:active={editor.isActive('underline')}>U</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={editor.isActive('heading', { level: 2 })}>H2</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
				class:active={editor.isActive('heading', { level: 3 })}>H3</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleBulletList().run()}
				class:active={editor.isActive('bulletList')}>Lista</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleOrderedList().run()}
				class:active={editor.isActive('orderedList')}>1.</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleBlockquote().run()}
				class:active={editor.isActive('blockquote')}>Citazione</button
			>
			<button
				type="button"
				on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
				class:active={editor.isActive('codeBlock')}>Codice</button
			>
			<button
				type="button"
				on:click={() => {
					const url = promptForUrl('URL del link');
					if (url) editor?.chain().focus().setLink({ href: url }).run();
				}}
				class:active={editor.isActive('link')}>Link</button
			>
			<button
				type="button"
				on:click={() => {
					const url = promptForUrl('URL dell’immagine');
					if (url) editor?.chain().focus().setImage({ src: url, alt: 'Immagine' }).run();
				}}>Immagine</button
			>
			<button type="button" on:click={() => insertBlock('video')}>Video</button>
			<button type="button" on:click={() => insertBlock('embed')}>Embed</button>
			<button type="button" on:click={() => insertBlock('gallery')}>Galleria</button>
			<button
				type="button"
				aria-haspopup="dialog"
				title="Inserisci un grafico o posiziona il cursore in un grafico esistente per modificarlo"
				on:click={openChartStudio}>Studio grafici</button
			>
			<button
				type="button"
				aria-haspopup="dialog"
				title="Scrivi un diagramma Mermaid con anteprima o posiziona il cursore in un diagramma esistente per modificarlo"
				on:click={openMermaidStudio}>Studio Mermaid</button
			>
			<button
				type="button"
				title="Racchiude il paragrafo in un box di nota; un secondo clic lo toglie"
				on:click={() => editor?.chain().focus().toggleCallout('info').run()}
				class:active={editor.isActive('callout')}>Box</button
			>
			<button type="button" title="Inserisce una tabella 3x3" on:click={insertTable}>Tabella</button
			>
			{#if editor.isActive('table')}
				<button type="button" on:click={() => editor?.chain().focus().addRowAfter().run()}
					>+ Riga</button
				>
				<button type="button" on:click={() => editor?.chain().focus().addColumnAfter().run()}
					>+ Colonna</button
				>
				<button type="button" on:click={() => editor?.chain().focus().deleteRow().run()}
					>- Riga</button
				>
				<button type="button" on:click={() => editor?.chain().focus().deleteColumn().run()}
					>- Colonna</button
				>
				<button type="button" on:click={() => editor?.chain().focus().deleteTable().run()}
					>Elimina tabella</button
				>
			{/if}
		</div>
	{/if}

	{#if pendingUploads > 0}
		<p class="upload-status">Caricamento immagini ({pendingUploads}) in corso…</p>
	{/if}

	<div class="editor prose" bind:this={editorElement} aria-label="Editor del contenuto"></div>
</div>

{#if chartStudio}
	<ChartStudio
		initial={chartStudio.initial}
		apply={applyChart}
		dismiss={() => (chartStudio = null)}
	/>
{/if}

{#if mermaidStudio}
	<MermaidStudio
		initial={mermaidStudio.initial}
		apply={applyMermaid}
		dismiss={() => (mermaidStudio = null)}
	/>
{/if}

<style>
	.editor-frame {
		display: grid;
		gap: 0.6rem;
		min-width: 0;
	}

	.toolbar {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0.6rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
	}

	.toolbar button {
		margin: 0;
		padding: 0.35rem 0.65rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		border-radius: 0;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		color: var(--automataColor);
		cursor: pointer;
		box-shadow: none;
		letter-spacing: normal;
		transition: all 0.15s ease-in-out;
	}

	.toolbar button:hover {
		background: var(--automataBgRGBA);
		color: var(--automataColor);
	}

	.toolbar button.active {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.upload-status {
		margin: 0.5rem 0 0;
		padding: 0.45rem 0.75rem;
		font-size: 0.9rem;
		background: var(--automataBgRGBA);
		border: 1px solid var(--automataColor);
	}

	.editor {
		min-height: 28rem;
		padding: 1rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
	}

	.editor :global(.ProseMirror) {
		min-height: 25rem;
		outline: none;
		line-height: 1.7;
		caret-color: var(--automataColor);
		color: var(--automataColor);
	}

	.editor :global(.block-edit-button) {
		display: block;
		margin-block: 0.75rem 0.25rem;
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		box-shadow: none;
		color: var(--automataColor);
		background: var(--automataBg);
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}

	.editor :global(table) {
		border-collapse: collapse;
		margin-block: 1rem;
	}

	.editor :global(th),
	.editor :global(td) {
		min-width: 4rem;
		padding: 0.4rem 0.7rem;
		border: 1px solid var(--yr-line-strong);
		vertical-align: top;
	}

	.editor :global(th) {
		background: var(--automataBgRGBA);
		text-align: left;
	}

	.editor :global(.selectedCell) {
		background: var(--automataBgRGBA);
	}

	.editor :global(.rich-callout) {
		margin-block: 1rem;
		padding: 0.6rem 1rem;
		border: 1px solid var(--yr-line-strong);
		border-left-width: 5px;
		background: var(--automataBgRGBA);
	}

	.editor :global(.callout-warning) {
		border-left-color: var(--automataRed);
	}

	.editor :global(.callout-tip) {
		border-left-color: var(--automataYellow);
	}

	:global(.slash-menu) {
		position: fixed;
		z-index: 50;
		display: grid;
		width: 17rem;
		max-height: 18rem;
		overflow-y: auto;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	:global(.slash-option) {
		display: grid;
		gap: 0.1rem;
		margin: 0;
		padding: 0.45rem 0.7rem;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--automataColor);
		background: var(--automataBg);
		cursor: pointer;
	}

	:global(.slash-option span) {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	:global(.slash-option[aria-selected='true']) {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.editor :global(.ProseMirror p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
		opacity: 0.55;
	}

	.editor :global(img),
	.editor :global(video),
	.editor :global(iframe) {
		max-width: 100%;
		margin-block: 1rem;
	}

	.editor :global(iframe) {
		width: 100%;
		min-height: 20rem;
		border: 0;
	}

	.editor :global(.rich-gallery) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(7rem, 100%), 1fr));
		gap: 0.75rem;
	}

	.editor :global(.rich-gallery img),
	.editor :global(.rich-gallery video) {
		width: 100%;
		aspect-ratio: 4 / 3;
		margin: 0;
		object-fit: cover;
	}

	.editor :global(.rich-grading) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding: 1rem;
		border-radius: 8px;
		width: 100%;
		margin: 1rem 0;
	}
	.editor :global(.rg-grade) {
		font-size: 4rem;
		font-weight: bold;
		grid-column: span 2;
		color: #26241e;
		width: 100px;
		height: 100px;
		border-radius: 100%;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 1;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.editor :global(.rg-low .rg-grade) {
		background-color: #cd674d;
	}
	.editor :global(.rg-max) {
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}
	.editor :global(.rg-mid .rg-grade) {
		background-color: #ece7d5;
	}
	.editor :global(.rg-high .rg-grade) {
		background-color: #e1d8aa;
	}
	.editor :global(.rg-list) {
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--automataBlack);
		color: var(--automataWhite);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.editor :global(.rg-pros) {
		border-left: 5px solid var(--automataYellow);
	}
	.editor :global(.rg-pros h3) {
		margin-top: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--automataYellow);
	}
	.editor :global(.rg-cons) {
		border-left: 5px solid var(--automataRed);
	}
	.editor :global(.rg-cons h3) {
		margin-top: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--automataRed);
	}
	.editor :global(.rg-title) {
		grid-column: span 2;
		font-weight: bold;
		text-align: center;
		margin: 1em 0 0;
		color: var(--automataColor);
	}
</style>
