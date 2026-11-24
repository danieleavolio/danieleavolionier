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

	const formId = 'content-form';
	const isNewItem = !item.slug;

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
	<div class="action-bar">
		<div class="action-title">
			<span class="yr-badge" class:yr-badge--alert={isNewItem} class:yr-badge--solid={!isNewItem}
				>{isNewItem ? 'Nuovo' : 'Modifica'}</span
			>
			<span class="action-name" title={item.title}>{item.title || 'Senza titolo'}</span>
		</div>
		<div class="action-buttons">
			<button type="button" class="yr-button yr-button--ghost" on:click={toggleMode}>
				{mode === 'edit' ? 'Anteprima' : 'Torna alla scrittura'}
			</button>
			<button
				type="button"
				class="yr-button yr-button--ghost"
				bind:this={zenButton}
				on:click={toggleZen}>{zen ? 'Esci da Zen' : 'Zen'}</button
			>
			<button type="submit" form={formId} class="yr-button yr-button--primary">Salva</button>
		</div>
	</div>

	<div class="workspace">
		{#if form?.message}<p class="status-bar" role="status">{form.message}</p>{/if}

		{#if mode === 'preview'}
			<div class="preview-pane">
				<PostPreview {item} />
			</div>
		{/if}

		<form
			id={formId}
			method="POST"
			action="?/save"
			use:enhance
			class="editor-form"
			class:is-hidden={mode === 'preview'}
			on:submit={syncForm}
		>
			<input type="hidden" name="original_slug" value={originalSlug} />
			<input type="hidden" name="content_html" value={item.contentHtml} />
			<input type="hidden" name="content_json" value={JSON.stringify(item.contentJson ?? null)} />
			<input type="hidden" name="metadata" value={JSON.stringify(item.metadata ?? {})} />
			<input type="hidden" name="legacy_content" value={item.legacyContent ?? ''} />

			<section class="yr-panel" aria-labelledby="sec-main">
				<h2 id="sec-main" class="yr-panel__head">
					<span class="yr-panel__square"></span>01 // Dati principali
				</h2>
				<div class="yr-panel__body main-grid">
					<div class="f-title">
						<label class="yr-label" for="title">Titolo</label>
						<input
							id="title"
							name="title"
							bind:value={item.title}
							on:input={handleTitleInput}
							required
						/>
					</div>
					<div class="f-slug">
						<label class="yr-label" for="slug">Slug</label>
						<input
							id="slug"
							name="slug"
							bind:value={item.slug}
							on:input={handleSlugInput}
							pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
							required
						/>
					</div>
					<div class="f-date">
						<label class="yr-label" for="date">Data</label>
						<input id="date" name="date" type="date" bind:value={item.date} required />
					</div>
					<div class="f-desc">
						<label class="yr-label" for="description">Descrizione</label>
						<textarea id="description" name="description" bind:value={item.description} required
						></textarea>
					</div>
				</div>
			</section>

			<div class="panel-row">
				<section class="yr-panel" aria-labelledby="sec-cat">
					<h2 id="sec-cat" class="yr-panel__head">
						<span class="yr-panel__square"></span>02 // Categorie
					</h2>
					<div class="yr-panel__body stack">
						<div>
							<label class="yr-label" for="categories">Categorie separate da virgola</label>
							<input
								id="categories"
								name="categories"
								value={categoryText}
								on:input={(event) => setCategories(event.currentTarget.value)}
							/>
						</div>
						{#if existingCategories.length}
							<div class="category-picker">
								<div class="picker-head">
									<span class="yr-label">Esistenti ({existingCategories.length})</span>
									<input
										type="search"
										aria-label="Filtra le categorie esistenti"
										placeholder="Filtra le categorie"
										bind:value={categoryFilter}
										on:keydown={(event) => {
											if (event.key === 'Enter') event.preventDefault();
										}}
									/>
								</div>
								<div class="category-options">
									{#each matchingCategories as category (category)}
										<button
											type="button"
											class="chip"
											class:selected={selectedCategories.has(categoryKey(category))}
											aria-pressed={selectedCategories.has(categoryKey(category))}
											on:click={() => toggleCategory(category)}>{category}</button
										>
									{:else}
										<p class="muted" role="status">Nessuna categoria corrispondente.</p>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</section>

				<section class="yr-panel" aria-labelledby="sec-cover">
					<h2 id="sec-cover" class="yr-panel__head">
						<span class="yr-panel__square"></span>03 // Copertina
					</h2>
					<div class="yr-panel__body stack">
						<div class="cover-field" class:dragging={coverDragging}>
							<label class="yr-label" for="image">URL o percorso</label>
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
							<div
								class="dropzone"
								role="button"
								tabindex="0"
								aria-label="Trascina o incolla un’immagine di copertina"
								on:dragover={(event) => {
									event.preventDefault();
									coverDragging = true;
								}}
								on:dragleave={() => (coverDragging = false)}
								on:drop={handleCoverDrop}
								on:paste={handleCoverPaste}
							>
								{#if coverUploading}
									<span role="status">Caricamento…</span>
								{:else}
									Trascina o incolla un’immagine qui
								{/if}
							</div>
						</div>
						{#if coverError}<p class="cover-error" role="alert">{coverError}</p>{/if}
						{#if item.image}
							<img class="cover-preview" src={item.image} alt="Anteprima della copertina" />
						{/if}
					</div>
				</section>

				<section class="yr-panel" aria-labelledby="sec-pub">
					<h2 id="sec-pub" class="yr-panel__head">
						<span class="yr-panel__square"></span>04 // Pubblicazione
					</h2>
					<div class="yr-panel__body stack">
						<Switch name="published" bind:checked={item.published} label="Pubblicato" />

						{#if item.metadata.contentType === 'posts'}
							<fieldset>
								<legend class="yr-label">Metadati recensione</legend>
								<label class="checkbox"
									><input
										type="checkbox"
										checked={review.isReview}
										on:change={(event) => updateReview('isReview', event.currentTarget.checked)}
									/> È una recensione</label
								>
								{#if review.isReview}
									<div>
										<label class="yr-label" for="gameName">Nome gioco</label>
										<input
											id="gameName"
											value={review.gameName}
											on:input={(event) => updateReview('gameName', event.currentTarget.value)}
										/>
									</div>
									<div>
										<label class="yr-label" for="gameImage">Immagine gioco (URL o percorso)</label>
										<input
											id="gameImage"
											type="text"
											placeholder="https://... oppure /images/..."
											value={review.gameImage}
											on:input={(event) => updateReview('gameImage', event.currentTarget.value)}
										/>
									</div>
									<div class="pair">
										<div>
											<label class="yr-label" for="ratingValue">Voto</label>
											<input
												id="ratingValue"
												type="number"
												min="0"
												max="10"
												step="0.1"
												value={review.ratingValue}
												on:input={(event) => updateReview('ratingValue', event.currentTarget.value)}
											/>
										</div>
										<div>
											<label class="yr-label" for="developer">Sviluppatore</label>
											<input
												id="developer"
												value={review.developer}
												on:input={(event) => updateReview('developer', event.currentTarget.value)}
											/>
										</div>
									</div>
								{/if}
							</fieldset>
						{/if}
					</div>
				</section>
			</div>

			<section class="yr-panel" aria-labelledby="sec-content">
				<h2 id="sec-content" class="yr-panel__head">
					<span class="yr-panel__square"></span>05 // Contenuto
				</h2>
				<div class="yr-panel__body">
					<RichTextEditor bind:html={item.contentHtml} bind:json={item.contentJson} />
				</div>
			</section>
		</form>
	</div>
</div>

<style>
	.action-bar {
		position: sticky;
		inset-block-start: 0;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem 1rem;
		margin: 0 0 1.25rem;
		padding: 0.55rem 0.8rem;
		border: 1px solid var(--yr-line);
		border-inline-start: 4px solid var(--yr-accent);
		background-color: var(--yr-surface);
		box-shadow: var(--yr-shadow);
	}
	.action-title {
		display: flex;
		align-items: center;
		flex: 1 1 14rem;
		gap: 0.7rem;
		min-width: 0;
	}
	.action-name {
		min-width: 0;
		overflow: hidden;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.action-buttons :global(.yr-button) {
		min-height: 2.2rem;
		padding-block: 0.25rem;
	}

	.status-bar {
		margin: 0 0 1.25rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--automataRed);
		border-inline-start-width: 4px;
		background-color: var(--yr-surface);
		font-family: var(--font-mono);
		font-size: 0.9rem;
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
	.zen-frame.active .action-bar {
		margin: 0;
		border-width: 0 0 1px;
		box-shadow: none;
	}
	.zen-frame.active .workspace {
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1.25rem 1rem 3rem;
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
		border: 1px solid var(--yr-line);
		background: var(--automataBg);
		box-shadow: var(--yr-shadow);
	}

	.editor-form {
		display: grid;
		gap: 1.25rem;
		min-width: 0;
	}
	.editor-form.is-hidden {
		display: none;
	}

	.main-grid {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 0.9rem 1rem;
	}
	.f-title,
	.f-desc {
		grid-column: 1 / -1;
	}
	.f-slug {
		grid-column: span 8;
	}
	.f-date {
		grid-column: span 4;
	}
	@media (min-width: 1100px) {
		.f-title {
			grid-column: span 6;
		}
		.f-slug {
			grid-column: span 4;
		}
		.f-date {
			grid-column: span 2;
		}
	}
	@media (max-width: 560px) {
		.f-slug,
		.f-date {
			grid-column: 1 / -1;
		}
	}

	.panel-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 21rem), 1fr));
		gap: 1.25rem;
		align-items: start;
	}

	.stack {
		display: grid;
		gap: 0.9rem;
	}

	.picker-head {
		display: grid;
		gap: 0.3rem;
		margin-bottom: 0.6rem;
	}
	.picker-head .yr-label {
		margin: 0;
	}

	.category-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		max-height: 11rem;
		overflow-y: auto;
		scrollbar-width: thin;
	}
	.chip {
		padding: 0.25rem 0.6rem;
		border: 1px solid var(--yr-line);
		border-radius: 0;
		background: var(--automataBg);
		box-shadow: none;
		color: var(--automataColor);
		font: inherit;
		font-size: 0.82rem;
		cursor: pointer;
	}
	.chip:hover {
		border-color: var(--automataColor);
	}
	.chip.selected {
		background: var(--automataRed);
		border-color: var(--automataRed);
		color: var(--automataWhite);
	}
	.muted {
		margin: 0;
		opacity: 0.7;
		font-size: 0.9rem;
	}

	.cover-field {
		display: grid;
		gap: 0.5rem;
	}
	.cover-field .yr-label {
		margin: 0;
	}
	.dropzone {
		display: grid;
		place-items: center;
		min-height: 4.5rem;
		padding: 0.75rem;
		border: 2px dashed var(--yr-line);
		background: var(--automataBg);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		text-align: center;
		cursor: copy;
	}
	.dropzone:focus-visible,
	.cover-field.dragging .dropzone {
		border-color: var(--automataRed);
		outline: none;
	}
	.cover-field.dragging input {
		border-color: var(--automataRed);
	}
	.cover-error {
		margin: 0;
		color: var(--automataRed);
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}
	.cover-preview {
		display: block;
		width: 100%;
		max-height: 11rem;
		border: 1px solid var(--yr-line);
		object-fit: cover;
	}

	input:not([type='checkbox']),
	textarea {
		background-color: var(--automataBg);
	}
	textarea {
		min-height: 6rem;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 400;
	}
	fieldset {
		display: grid;
		gap: 0.75rem;
		min-width: 0;
		margin: 0;
		padding: 0.8rem;
		border: 1px solid var(--yr-line);
	}
	legend {
		padding-inline: 0.4rem;
	}
	fieldset .yr-label {
		margin-bottom: 0.3rem;
	}
	.pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
		gap: 0.75rem;
	}
</style>
