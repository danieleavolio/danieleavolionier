<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from '#lib/components/RichTextEditor.svelte';
	import Switch from '#lib/components/ui/Switch.svelte';
	import PostPreview from '#lib/components/PostPreview.svelte';
	import { findImageFiles, uploadImage } from '#lib/media.ts';
	import type { EditableContent } from '#lib/server/admin-content.ts';

	export let item: EditableContent;
	export let form;
	export let categoryOptions: string[] = [];

	let categoryText = item.categories.join(', ');
	let categoryFilter = '';

	function categoryKey(value: string): string {
		return value.trim().toLocaleLowerCase('it');
	}

	function searchKey(value: string): string {
		return categoryKey(value).normalize('NFD').replace(/\p{M}/gu, '');
	}

	function setCategories(value: string) {
		categoryText = value;
		item.categories = value
			.split(',')
			.map((category) => category.trim())
			.filter(Boolean);
	}

	function toggleCategory(category: string) {
		if (selectedCategories.has(categoryKey(category))) {
			setCategories(
				item.categories.filter((value) => categoryKey(value) !== categoryKey(category)).join(', ')
			);
		} else {
			setCategories([...item.categories, category].join(', '));
		}
	}

	let coverUploading = false;
	let coverError = '';
	let coverDragging = false;

	async function uploadCover(file: File) {
		coverUploading = true;
		coverError = '';
		try {
			const { url } = await uploadImage(file);
			item.image = url;
		} catch (cause) {
			coverError = cause instanceof Error ? cause.message : 'Caricamento non riuscito.';
		} finally {
			coverUploading = false;
		}
	}

	function handleCoverDrop(event: DragEvent) {
		event.preventDefault();
		coverDragging = false;
		const [file] = findImageFiles(event.dataTransfer);
		if (file) void uploadCover(file);
		else coverError = 'Trascina un file jpg, png, webp, gif o avif.';
	}

	function handleCoverPaste(event: ClipboardEvent) {
		const [file] = findImageFiles(event.clipboardData);
		if (!file) return;
		event.preventDefault();
		void uploadCover(file);
	}

	$: existingCategories = [
		...new Map(
			categoryOptions.map((category) => [categoryKey(category), category.trim()] as const)
		).values()
	]
		.filter(Boolean)
		.sort((a, b) => a.localeCompare(b, 'it'));
	$: matchingCategories = existingCategories.filter((category) =>
		searchKey(category).includes(searchKey(categoryFilter))
	);
	$: selectedCategories = new Set(item.categories.map(categoryKey));

	$: item.metadata = item.metadata ?? {};
	$: review = {
		isReview: Boolean(item.metadata.isReview),
		gameName: String(item.metadata.gameName ?? ''),
		gameImage: String(item.metadata.gameImage ?? ''),
		ratingValue: String(item.metadata.ratingValue ?? ''),
		developer: String(item.metadata.developer ?? '')
	};

	function updateReview(key: string, value: unknown) {
		item.metadata = { ...item.metadata, [key]: value };
	}

	function buildMetadata() {
		return {
			...item.metadata,
			isReview: review.isReview,
			gameName: review.gameName,
			gameImage: review.gameImage,
			ratingValue: review.ratingValue ? Number(review.ratingValue) : undefined,
			developer: review.developer
		};
	}

	const originalSlug = item.slug;
	let slugManuallyEdited = Boolean(item.slug);

	function slugify(text: string): string {
		return text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function handleTitleInput() {
		if (!slugManuallyEdited) {
			item.slug = slugify(item.title);
		}
	}

	function handleSlugInput() {
		slugManuallyEdited = true;
	}

	let mode: 'edit' | 'preview' = 'edit';
	let zen = false;
	let zenButton: HTMLButtonElement;

	function toggleMode() {
		mode = mode === 'edit' ? 'preview' : 'edit';
	}

	function toggleZen() {
		zen = !zen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (zen && event.key === 'Escape') {
			zen = false;
			zenButton.focus({ preventScroll: true });
		}
	}

	function syncForm(event: SubmitEvent) {
		const form = event.currentTarget as HTMLFormElement;
		const metadata = buildMetadata();
		item.metadata = metadata;
		(form.elements.namedItem('content_html') as HTMLInputElement).value = item.contentHtml;
		(form.elements.namedItem('content_json') as HTMLInputElement).value = JSON.stringify(
			item.contentJson ?? null
		);
		(form.elements.namedItem('metadata') as HTMLInputElement).value = JSON.stringify(metadata);
		(form.elements.namedItem('legacy_content') as HTMLInputElement).value =
			item.legacyContent ?? '';
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="zen-frame" class:active={zen}>
	<div class="mode-bar">
		<button type="button" on:click={toggleMode}>
			{mode === 'edit' ? 'Anteprima' : 'Torna alla scrittura'}
		</button>
		<button type="button" bind:this={zenButton} on:click={toggleZen}
			>{zen ? 'Esci da Zen' : 'Zen'}</button
		>
	</div>

	<div class="workspace">
		{#if mode === 'preview'}
			<div class="preview-pane">
				<PostPreview {item} />
			</div>
		{:else}
			<form method="POST" action="?/save" use:enhance class="editor-form" on:submit={syncForm}>
				<h1>{originalSlug ? 'Modifica contenuto' : 'Nuovo contenuto'}</h1>
				<input type="hidden" name="original_slug" value={originalSlug} />
				<input type="hidden" name="content_html" value={item.contentHtml} />
				<input type="hidden" name="content_json" value={JSON.stringify(item.contentJson ?? null)} />
				<input type="hidden" name="metadata" value={JSON.stringify(item.metadata ?? {})} />
				<input type="hidden" name="legacy_content" value={item.legacyContent ?? ''} />

				<label for="title">Titolo</label>
				<input
					id="title"
					name="title"
					bind:value={item.title}
					on:input={handleTitleInput}
					required
				/>

				<label for="slug">Slug</label>
				<input
					id="slug"
					name="slug"
					bind:value={item.slug}
					on:input={handleSlugInput}
					pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
					required
				/>

				<label for="description">Descrizione</label>
				<textarea id="description" name="description" bind:value={item.description} required
				></textarea>

				<label for="date">Data</label>
				<input id="date" name="date" type="date" bind:value={item.date} required />

				<label for="categories">Categorie separate da virgola</label>
				<input
					id="categories"
					name="categories"
					value={categoryText}
					on:input={(event) => setCategories(event.currentTarget.value)}
				/>
				{#if existingCategories.length}
					<details class="category-picker">
						<summary>Categorie esistenti ({existingCategories.length})</summary>
						<input
							type="search"
							aria-label="Filtra le categorie esistenti"
							placeholder="Filtra le categorie"
							bind:value={categoryFilter}
							on:keydown={(event) => {
								if (event.key === 'Enter') event.preventDefault();
							}}
						/>
						<div class="category-options">
							{#each matchingCategories as category (category)}
								<button
									type="button"
									class:selected={selectedCategories.has(categoryKey(category))}
									aria-pressed={selectedCategories.has(categoryKey(category))}
									on:click={() => toggleCategory(category)}>{category}</button
								>
							{:else}
								<p role="status">Nessuna categoria corrispondente.</p>
							{/each}
						</div>
					</details>
				{/if}

				<label for="image">Immagine di copertina (URL o percorso)</label>
				<div class="cover-field" class:dragging={coverDragging}>
					<input
						id="image"
						name="image"
						type="text"
						placeholder="https://... oppure /images/..."
						bind:value={item.image}
						on:dragover={(event) => {
							event.preventDefault();
							coverDragging = true;
						}}
						on:dragleave={() => (coverDragging = false)}
						on:drop={handleCoverDrop}
						on:paste={handleCoverPaste}
					/>
					{#if coverUploading}<span class="cover-status" role="status">Caricamento…</span>{/if}
				</div>
				{#if coverError}<p class="cover-error" role="alert">{coverError}</p>{/if}
				<p class="cover-hint">Puoi anche trascinare o incollare un’immagine qui.</p>

				<Switch name="published" bind:checked={item.published} label="Pubblicato" />

				{#if item.metadata.contentType === 'posts'}
					<fieldset>
						<legend>Metadati recensione</legend>
						<label class="checkbox"
							><input
								type="checkbox"
								checked={review.isReview}
								on:change={(event) => updateReview('isReview', event.currentTarget.checked)}
							/> È una recensione</label
						>
						{#if review.isReview}
							<label for="gameName">Nome gioco</label>
							<input
								id="gameName"
								value={review.gameName}
								on:input={(event) => updateReview('gameName', event.currentTarget.value)}
							/>
							<label for="gameImage">Immagine gioco (URL o percorso)</label>
							<input
								id="gameImage"
								type="text"
								placeholder="https://... oppure /images/..."
								value={review.gameImage}
								on:input={(event) => updateReview('gameImage', event.currentTarget.value)}
							/>
							<label for="ratingValue">Voto</label>
							<input
								id="ratingValue"
								type="number"
								min="0"
								max="10"
								step="0.1"
								value={review.ratingValue}
								on:input={(event) => updateReview('ratingValue', event.currentTarget.value)}
							/>
							<label for="developer">Sviluppatore</label>
							<input
								id="developer"
								value={review.developer}
								on:input={(event) => updateReview('developer', event.currentTarget.value)}
							/>
						{/if}
					</fieldset>
				{/if}

				<p class="field-label">Contenuto</p>
				<RichTextEditor bind:html={item.contentHtml} bind:json={item.contentJson} />
				<button type="submit">Salva</button>
				{#if form?.message}<p class="message">{form.message}</p>{/if}
			</form>
		{/if}
	</div>
</div>

<style>
	.mode-bar {
		display: flex;
		gap: 0.5rem;
		margin: 0 0 1rem;
	}
	.mode-bar button {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		padding: 0.45rem 1rem;
		background: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		white-space: nowrap;
	}
	.mode-bar button:hover {
		background: var(--automataColor);
		color: var(--automataBg);
	}
	.zen-frame.active {
		position: fixed;
		inset: 0;
		z-index: 30;
		visibility: visible;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		background: var(--automataBg);
	}
	.zen-frame.active .mode-bar {
		margin: 0;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--automataColor);
	}
	.zen-frame.active .workspace {
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0 1rem 3rem;
	}
	.zen-frame.active form {
		max-width: min(72rem, 94vw);
		margin: 0 auto;
	}
	.zen-frame.active :global(.preview-pane) {
		max-width: min(60rem, 92vw);
		margin: 0 auto;
	}
	.zen-frame.active :global(.editor),
	.zen-frame.active :global(.ProseMirror) {
		min-height: auto;
	}
	.preview-pane {
		padding: 1.5rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
	}

	.editor-form {
		display: grid;
		gap: 0.6rem;
	}

	.category-picker {
		border: 1px solid var(--automataColor);
		padding: 0.65rem;
	}

	.category-picker summary {
		cursor: pointer;
	}

	.category-picker input {
		inline-size: 100%;
		margin-block: 0.6rem;
	}

	.category-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.category-options button {
		padding: 0.35rem 0.6rem;
		font: inherit;
		border-radius: 0;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		color: var(--automataColor);
		box-shadow: none;
	}

	.category-options button.selected {
		background: var(--automataRed);
		border-color: var(--automataRed);
		color: #fff;
	}

	.cover-field {
		position: relative;
		display: grid;
	}

	.cover-field.dragging input {
		border-color: var(--automataRed);
		outline: 2px dashed var(--automataRed);
		outline-offset: 2px;
	}

	.cover-status,
	.cover-error {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}

	.cover-status {
		position: absolute;
		inset-inline-end: 0.6rem;
		inset-block-start: 0.75rem;
		background: var(--automataBg);
		color: var(--automataRed);
	}

	.cover-error {
		color: var(--automataRed);
	}

	.cover-hint {
		margin: -0.2rem 0 0;
		font-size: 0.85rem;
		opacity: 0.75;
	}

	label,
	legend,
	.field-label {
		font-weight: 700;
	}

	input:not([type='checkbox']),
	textarea {
		padding: 0.65rem;
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
		color: var(--automataColor);
		border-radius: 0;
	}

	textarea {
		min-height: 6rem;
		resize: vertical;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 400;
	}

	fieldset {
		display: grid;
		gap: 0.6rem;
		margin-block: 1rem;
		padding: 1rem;
		border: 1px solid var(--automataColor);
	}

	button[type='submit'] {
		margin-top: 1.25rem;
		padding: 0.85rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.25rem;
		background: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	button[type='submit']:hover {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	button[type='submit']:active {
		transform: translateY(1px);
	}

	.message {
		padding: 0.75rem;
		background: var(--automataBgRGBA);
		border: 1px solid var(--automataColor);
	}
</style>
