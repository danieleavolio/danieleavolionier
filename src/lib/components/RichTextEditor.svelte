<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import { createRichExtensions } from '$lib/editor/extensions';
	import { findImageFiles, uploadImage } from '$lib/media';
	import type { RichTextDocument } from '$lib/types';

	export let html = '';
	export let json: RichTextDocument | null = null;
	export let placeholder = 'Scrivi il contenuto…';

	const dispatch = createEventDispatcher<{ change: { html: string; json: RichTextDocument } }>();
	let editorElement: HTMLDivElement;
	let editor: Editor | null = null;
	let pendingUploads = 0;

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
			if (files.length === 0) return false;
			event.preventDefault();
			void uploadAndInsertFiles(files);
			return true;
		}
	};

	function promptForUrl(message: string): string | null {
		const value = window.prompt(message, 'https://');
		return value?.trim() || null;
	}

	function insertBlock(kind: string) {
		if (!editor) return;
		const src = promptForUrl(
			kind === 'gallery'
				? 'Inserisci gli URL delle immagini separati da virgola'
				: 'Inserisci l’URL del contenuto'
		);
		if (!src) return;

		if (kind === 'gallery') {
			editor
				.chain()
				.focus()
				.insertContent({
					type: 'richBlock',
					attrs: {
						kind,
						images: src
							.split(',')
							.map((item) => item.trim())
							.filter(Boolean)
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
				StarterKit,
				Underline,
				Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
				Image.configure({ allowBase64: false }),
				Placeholder.configure({ placeholder }),
				...createRichExtensions()
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

{#if editor}
	<div class="toolbar" aria-label="Strumenti di formattazione">
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
	</div>
{/if}

{#if pendingUploads > 0}
	<p class="upload-status">Caricamento immagini ({pendingUploads}) in corso…</p>
{/if}

<div class="editor prose" bind:this={editorElement} aria-label="Editor del contenuto"></div>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0.6rem;
		border: 1px solid var(--automataColor);
		border-bottom: 0;
		background: var(--automataBgRGBA);
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
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: 0.75rem;
	}

	.editor :global(.rich-gallery img) {
		width: 100%;
		aspect-ratio: 4 / 3;
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
		color: var(--automataWhite);
		width: 100px;
		height: 100px;
		border-radius: 100%;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.editor :global(.rg-low .rg-grade) {
		background-color: #cd674d;
	}
	.editor :global(.rg-mid .rg-grade) {
		background-color: #ece7d5;
		color: var(--automataBlack0);
	}
	.editor :global(.rg-high .rg-grade) {
		background-color: #e1d8aa;
		color: var(--automataBlack0);
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
		color: var(--automataWhite);
	}
	.editor :global(.rg-low .rg-title) {
		color: #cd674d;
	}
	.editor :global(.rg-mid .rg-title) {
		color: #ece7d5;
	}
	.editor :global(.rg-high .rg-title) {
		color: #e1d8aa;
	}
</style>
