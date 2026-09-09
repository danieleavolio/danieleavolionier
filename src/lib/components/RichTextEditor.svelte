<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Underline from '@tiptap/extension-underline';
	import Placeholder from '@tiptap/extension-placeholder';
	import { createRichExtensions } from '$lib/editor/extensions';
	import type { RichTextDocument } from '$lib/types';

	export let html = '';
	export let json: RichTextDocument | null = null;
	export let placeholder = 'Scrivi il contenuto…';

	const dispatch = createEventDispatcher<{ change: { html: string; json: RichTextDocument } }>();
	let editorElement: HTMLDivElement;
	let editor: Editor | null = null;

	function emitChange() {
		if (!editor) return;
		html = editor.getHTML();
		json = editor.getJSON() as RichTextDocument;
		dispatch('change', { html, json });
	}

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
			onUpdate: emitChange
		});
	});

	onDestroy(() => editor?.destroy());
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
		<button type="button" on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
			>H2</button
		>
		<button type="button" on:click={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
			>H3</button
		>
		<button type="button" on:click={() => editor?.chain().focus().toggleBulletList().run()}
			>Lista</button
		>
		<button type="button" on:click={() => editor?.chain().focus().toggleOrderedList().run()}
			>1.</button
		>
		<button type="button" on:click={() => editor?.chain().focus().toggleBlockquote().run()}
			>Citazione</button
		>
		<button type="button" on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
			>Codice</button
		>
		<button
			type="button"
			on:click={() => {
				const url = promptForUrl('URL del link');
				if (url) editor?.chain().focus().setLink({ href: url }).run();
			}}>Link</button
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

<div class="editor" bind:this={editorElement} aria-label="Editor del contenuto"></div>

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
		padding: 0.3rem 0.55rem;
		font-size: 0.8rem;
		letter-spacing: normal;
	}

	.toolbar button.active {
		background: var(--automataColor);
		color: var(--automataBg);
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
</style>
