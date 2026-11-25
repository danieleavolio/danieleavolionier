<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Editor, Extension, type Range } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
	import {
		CodeBlockLanguagePicker,
		codeBlockEditButtons,
		createRichExtensions,
		slashMenu,
		type CalloutTone,
		type SlashItem
	} from '#lib/editor/extensions.ts';
	import { findImageFiles, uploadImage } from '#lib/media.ts';
	import { parseChart, type ChartSettings } from '#lib/bar-chart.ts';
	import type { RichTextDocument } from '#lib/types.ts';
	import ChartStudio from '#lib/components/ChartStudio.svelte';
	import MermaidStudio from '#lib/components/MermaidStudio.svelte';
	import CoverStudio from '#lib/components/CoverStudio.svelte';
	import InsertPanel, {
		type InsertKind,
		type InsertResult
	} from '#lib/components/InsertPanel.svelte';

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
	let insertPanel: { kind: InsertKind; text: string; href: string } | null = null;
	let imageStudioOpen = false;
	let bubble: { left: number; top: number } | null = null;

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

	let calloutTone: CalloutTone = 'info';
	// Tono del box in cui si trova il cursore; l'espressione legge `editor` per restare reattiva.
	$: activeTone = editor?.isActive('callout')
		? ((editor.getAttributes('callout').tone as CalloutTone) ?? null)
		: null;

	function setCalloutTone(tone: CalloutTone) {
		calloutTone = tone;
		if (editor?.isActive('callout')) {
			editor.chain().focus().updateAttributes('callout', { tone }).run();
		}
	}

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

	function openInsert(kind: InsertKind) {
		if (!editor) return;
		if (kind !== 'link') {
			insertPanel = { kind, text: '', href: '' };
			return;
		}
		editor.chain().extendMarkRange('link').run();
		const { from, to } = editor.state.selection;
		insertPanel = {
			kind,
			text: editor.state.doc.textBetween(from, to, ' '),
			href: (editor.getAttributes('link').href as string | undefined) ?? ''
		};
	}

	function applyInsert(result: InsertResult) {
		const chain = editor?.chain().focus();
		if (!chain || !editor) return;
		if (result.kind === 'unlink') {
			chain.extendMarkRange('link').unsetLink().run();
		} else if (result.kind === 'link') {
			const { from, to, empty } = editor.state.selection;
			const current = editor.state.doc.textBetween(from, to, ' ');
			const label = result.text || current || result.href;
			if (empty || label !== current.trim()) {
				chain
					.insertContentAt(
						{ from, to },
						{ type: 'text', text: label, marks: [{ type: 'link', attrs: { href: result.href } }] }
					)
					.unsetMark('link')
					.run();
			} else {
				chain.setLink({ href: result.href }).run();
			}
		} else if (result.kind === 'image') {
			chain.setImage({ src: result.src, alt: result.alt || 'Immagine' }).run();
		} else if (result.kind === 'gallery') {
			chain
				.insertContent({ type: 'richBlock', attrs: { kind: 'gallery', images: result.images } })
				.run();
		} else {
			chain
				.insertContent({ type: 'richBlock', attrs: { kind: result.kind, src: result.src } })
				.run();
		}
		emitChange();
	}

	async function insertGeneratedImage(file: File) {
		const { url } = await uploadImage(file);
		editor
			?.chain()
			.focus()
			.setImage({ src: url, alt: file.name.replace(/.png$/, '') })
			.run();
		emitChange();
	}

	function updateBubble() {
		// Reassigning invalidates the toolbar, so active states follow the cursor.
		editor = editor;
		if (
			!editor ||
			!editor.isFocused ||
			editor.state.selection.empty ||
			editor.isActive('codeBlock')
		) {
			bubble = null;
			return;
		}
		const { from, to } = editor.state.selection;
		const start = editor.view.coordsAtPos(from);
		const end = editor.view.coordsAtPos(to);
		bubble = { left: (start.left + end.right) / 2, top: Math.min(start.top, end.top) };
	}

	// Ctrl+G is the Italian Word shortcut for bold: keep muscle memory working.
	const ItalianShortcuts = Extension.create({
		name: 'italianShortcuts',
		addKeyboardShortcuts() {
			return {
				'Mod-g': () => this.editor.commands.toggleBold(),
				'Mod-k': () => {
					openInsert('link');
					return true;
				}
			};
		}
	});

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
				ItalianShortcuts,
				...createRichExtensions(),
				slashMenu(() => slashItems),
				CodeBlockLanguagePicker,
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
			onUpdate: emitChange,
			onTransaction: updateBubble,
			onBlur: () => setTimeout(updateBubble, 0)
		});
		window.addEventListener('scroll', updateBubble, { passive: true, capture: true });
	});

	onDestroy(() => {
		if (typeof window !== 'undefined')
			window.removeEventListener('scroll', updateBubble, { capture: true });
		editor?.destroy();
	});
	$: if (editor && (html || json) && editor.getHTML() !== html) {
		if (!editor.isFocused) {
			editor.commands.setContent(json ?? html ?? '', { emitUpdate: false });
		}
	}
</script>

<div class="editor-frame">
	{#if editor}
		<div class="toolbar" role="toolbar" aria-label="Strumenti di formattazione">
			<div class="group" role="group" aria-label="Testo">
				<button
					type="button"
					class="icon"
					title="Grassetto (Ctrl+B o Ctrl+G)"
					aria-label="Grassetto"
					on:click={() => editor?.chain().focus().toggleBold().run()}
					class:active={editor.isActive('bold')}><b>B</b></button
				>
				<button
					type="button"
					class="icon"
					title="Corsivo (Ctrl+I)"
					aria-label="Corsivo"
					on:click={() => editor?.chain().focus().toggleItalic().run()}
					class:active={editor.isActive('italic')}><i>I</i></button
				>
				<button
					type="button"
					class="icon"
					title="Sottolineato (Ctrl+U)"
					aria-label="Sottolineato"
					on:click={() => editor?.chain().focus().toggleUnderline().run()}
					class:active={editor.isActive('underline')}><u>U</u></button
				>
				<button
					type="button"
					class="icon"
					title="Barrato"
					aria-label="Barrato"
					on:click={() => editor?.chain().focus().toggleStrike().run()}
					class:active={editor.isActive('strike')}><s>S</s></button
				>
				<button
					type="button"
					class="icon"
					title="Codice in linea"
					aria-label="Codice in linea"
					on:click={() => editor?.chain().focus().toggleCode().run()}
					class:active={editor.isActive('code')}>`</button
				>
			</div>

			<div class="group" role="group" aria-label="Struttura">
				<button
					type="button"
					class="icon"
					title="Titolo di sezione"
					on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
					class:active={editor.isActive('heading', { level: 2 })}>H2</button
				>
				<button
					type="button"
					class="icon"
					title="Sottotitolo"
					on:click={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
					class:active={editor.isActive('heading', { level: 3 })}>H3</button
				>
				<button
					type="button"
					class="icon"
					title="Elenco puntato"
					aria-label="Elenco puntato"
					on:click={() => editor?.chain().focus().toggleBulletList().run()}
					class:active={editor.isActive('bulletList')}>•</button
				>
				<button
					type="button"
					class="icon"
					title="Elenco numerato"
					aria-label="Elenco numerato"
					on:click={() => editor?.chain().focus().toggleOrderedList().run()}
					class:active={editor.isActive('orderedList')}>1.</button
				>
				<button
					type="button"
					class="icon"
					title="Citazione"
					aria-label="Citazione"
					on:click={() => editor?.chain().focus().toggleBlockquote().run()}
					class:active={editor.isActive('blockquote')}>“</button
				>
				<button
					type="button"
					class="icon"
					title="Blocco di codice"
					aria-label="Blocco di codice"
					on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
					class:active={editor.isActive('codeBlock')}>{'{}'}</button
				>
			</div>

			<div class="group" role="group" aria-label="Inserisci">
				<button
					type="button"
					title="Link (Ctrl+K)"
					aria-haspopup="dialog"
					on:click={() => openInsert('link')}
					class:active={editor.isActive('link')}>Link</button
				>
				<button type="button" aria-haspopup="dialog" on:click={() => openInsert('image')}
					>Immagine</button
				>
				<button type="button" aria-haspopup="dialog" on:click={() => openInsert('video')}
					>Video</button
				>
				<button type="button" aria-haspopup="dialog" on:click={() => openInsert('gallery')}
					>Galleria</button
				>
				<button
					type="button"
					aria-haspopup="dialog"
					title="Incorpora una pagina esterna"
					on:click={() => openInsert('embed')}>Embed</button
				>
				<button
					type="button"
					title="Box di nota; un secondo clic lo toglie"
					on:click={() => editor?.chain().focus().toggleCallout(calloutTone).run()}
					class:active={editor.isActive('callout')}>Box</button
				>
				<select
					aria-label="Colore del box"
					title="Colore del box"
					value={activeTone ?? calloutTone}
					on:change={(event) => setCalloutTone(event.currentTarget.value as CalloutTone)}
				>
					{#each Object.entries(TONE_LABELS) as [tone, label] (tone)}
						<option value={tone}>{label}</option>
					{/each}
				</select>
				<button type="button" title="Tabella 3×3" on:click={insertTable}>Tabella</button>
			</div>

			<div class="group studios" role="group" aria-label="Studi">
				<button
					type="button"
					aria-haspopup="dialog"
					title="Grafico a barre, colonne o linea"
					on:click={openChartStudio}>◧ Grafico</button
				>
				<button
					type="button"
					aria-haspopup="dialog"
					title="Diagramma Mermaid con anteprima"
					on:click={openMermaidStudio}>⌬ Diagramma</button
				>
				<button
					type="button"
					aria-haspopup="dialog"
					title="Crea un’immagine in stile YoRHa e inseriscila qui"
					on:click={() => (imageStudioOpen = true)}>▣ Crea immagine</button
				>
			</div>

			{#if editor.isActive('table')}
				<div class="group" role="group" aria-label="Tabella">
					<button type="button" on:click={() => editor?.chain().focus().addRowAfter().run()}
						>+ Riga</button
					>
					<button type="button" on:click={() => editor?.chain().focus().addColumnAfter().run()}
						>+ Colonna</button
					>
					<button type="button" on:click={() => editor?.chain().focus().deleteRow().run()}
						>− Riga</button
					>
					<button type="button" on:click={() => editor?.chain().focus().deleteColumn().run()}
						>− Colonna</button
					>
					<button
						type="button"
						class="danger"
						on:click={() => editor?.chain().focus().deleteTable().run()}>Elimina</button
					>
				</div>
			{/if}
		</div>
	{/if}

	{#if bubble && editor}
		<div
			class="bubble"
			role="toolbar"
			aria-label="Formattazione della selezione"
			style:left={`${bubble.left}px`}
			style:top={`${bubble.top}px`}
		>
			<button
				type="button"
				aria-label="Grassetto"
				on:mousedown|preventDefault={() => editor?.chain().focus().toggleBold().run()}
				class:active={editor.isActive('bold')}><b>B</b></button
			>
			<button
				type="button"
				aria-label="Corsivo"
				on:mousedown|preventDefault={() => editor?.chain().focus().toggleItalic().run()}
				class:active={editor.isActive('italic')}><i>I</i></button
			>
			<button
				type="button"
				aria-label="Sottolineato"
				on:mousedown|preventDefault={() => editor?.chain().focus().toggleUnderline().run()}
				class:active={editor.isActive('underline')}><u>U</u></button
			>
			<button
				type="button"
				aria-label="Codice in linea"
				on:mousedown|preventDefault={() => editor?.chain().focus().toggleCode().run()}
				class:active={editor.isActive('code')}>`</button
			>
			<button
				type="button"
				on:mousedown|preventDefault={() => openInsert('link')}
				class:active={editor.isActive('link')}>Link</button
			>
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

{#if insertPanel}
	<InsertPanel
		kind={insertPanel.kind}
		initialText={insertPanel.text}
		initialHref={insertPanel.href}
		apply={applyInsert}
		dismiss={() => {
			insertPanel = null;
			editor?.commands.focus();
		}}
	/>
{/if}

{#if imageStudioOpen}
	<CoverStudio bind:open={imageStudioOpen} mode="inline" onuse={insertGeneratedImage} />
{/if}

<style>
	.editor-frame {
		display: grid;
		gap: 0.6rem;
		min-width: 0;
	}

	.toolbar {
		position: sticky;
		top: var(--editor-sticky-top, 0px);
		z-index: 3;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0;
		padding: 0.35rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		box-shadow: 0 6px 12px -10px rgb(0 0 0 / 45%);
	}

	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		padding-inline: 0.4rem;
		border-right: 1px dashed var(--yr-line);
	}

	.group:last-child {
		border-right: 0;
	}

	.toolbar button,
	.bubble button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-block-size: 2rem;
		margin: 0;
		padding: 0 0.6rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		border-radius: 0;
		border: 1px solid transparent;
		background: transparent;
		color: var(--automataColor);
		cursor: pointer;
		box-shadow: none;
		transition:
			background-color 0.08s,
			color 0.08s;
	}

	.toolbar select {
		inline-size: auto;
		min-block-size: 2rem;
		margin: 0 0.15rem;
		padding: 0 1.8rem 0 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		border-radius: 0;
		border: 1px solid var(--yr-line-strong);
		background: transparent;
		color: var(--automataColor);
		cursor: pointer;
	}

	.toolbar button.icon {
		min-inline-size: 2rem;
		padding: 0;
		font-size: 0.9rem;
	}

	.toolbar button:hover,
	.bubble button:hover {
		border-color: var(--yr-line-strong);
		background: var(--automataBgRGBA);
	}

	.toolbar button:active,
	.bubble button:active {
		transform: translateY(1px);
	}

	.toolbar button.active,
	.bubble button.active {
		border-color: var(--automataColor);
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.toolbar button:focus-visible,
	.bubble button:focus-visible {
		outline: 2px solid var(--automataColor);
		outline-offset: 1px;
	}

	.toolbar button.danger {
		color: var(--automataRed);
	}

	.studios button {
		border-color: var(--yr-line);
	}

	.bubble {
		position: fixed;
		z-index: 40;
		display: flex;
		gap: 2px;
		padding: 3px;
		transform: translate(-50%, calc(-100% - 0.5rem));
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		box-shadow: 4px 4px 0 rgb(0 0 0 / 18%);
		animation: bubble-in 0.1s ease-out;
	}

	.bubble button {
		min-inline-size: 2rem;
		padding: 0 0.45rem;
	}

	@keyframes bubble-in {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-100% - 0.2rem));
		}
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

	.editor {
		transition: border-color 0.12s;
	}

	.editor:focus-within {
		border-color: var(--automataColor);
		box-shadow: inset 3px 0 0 var(--automataColor);
	}

	.editor :global(.ProseMirror) {
		min-height: 25rem;
		outline: none;
		line-height: 1.7;
		caret-color: var(--automataRed);
		caret-shape: block;
		color: var(--automataColor);
	}

	.editor :global(.ProseMirror ::selection) {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.editor :global(.block-language-select) {
		display: block;
		margin-block: 0.75rem 0.25rem;
		padding: 0.25rem 0.4rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBg);
		font-family: var(--font-mono);
		font-size: 0.8rem;
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
