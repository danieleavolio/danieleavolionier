<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from '#lib/components/RichTextEditor.svelte';
	import Switch from '#lib/components/ui/Switch.svelte';
	import PostPreview from '#lib/components/PostPreview.svelte';
	import CoverStudio from '#lib/components/CoverStudio.svelte';
	import { readCoverSpec } from '#lib/editor/cover-meta.ts';
	import type { CoverSpec } from '#lib/editor/cover-render.ts';
	import { onDestroy, onMount } from 'svelte';
	import { findImageFiles, uploadImage } from '#lib/media.ts';
	import {
		clearDraft,
		draftFields,
		draftKey,
		loadDraft,
		saveDraft,
		serializeFields,
		type StoredDraft
	} from '#lib/editor/draft-storage.ts';
	import type { EditableContent } from '#lib/server/admin-content.ts';
	import type { SubmitFunction } from '$app/forms';

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

	let coverStudioOpen = false;
	// Settings stored in covers made with the studio; plain uploads have none.
	let coverSpec: CoverSpec | null = null;
	let coverSpecFor = '';
	let coverEditing = false;

	async function loadCoverSpec(url: string) {
		if (url === coverSpecFor) return;
		coverSpecFor = url;
		coverSpec = null;
		if (!url) return;
		try {
			const response = await fetch(url);
			if (!response.ok) return;
			const spec = readCoverSpec(await response.arrayBuffer());
			if (url === coverSpecFor) coverSpec = spec;
		} catch {
			// Unreachable or cross-origin image: it just stays a plain image.
		}
	}
	$: void loadCoverSpec(item.image ?? '');

	function openCoverStudio(edit: boolean) {
		coverEditing = edit && Boolean(coverSpec);
		coverStudioOpen = true;
	}

	// Errors propagate so the studio stays open and shows them.
	async function useGeneratedCover(file: File) {
		const { url } = await uploadImage(file);
		item.image = url;
		coverError = '';
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

	// ---------- Autosave (local only) ----------
	const storageKey = draftKey(item.metadata?.contentType, originalSlug);
	let baseline = serializeFields(draftFields(item));
	let pendingDraft: StoredDraft | null = null;
	let draftReady = false;
	let draftTimer: ReturnType<typeof setTimeout> | undefined;
	let editorKey = 0;

	onMount(() => {
		const stored = loadDraft(storageKey);
		if (stored && serializeFields(stored.fields) !== baseline) pendingDraft = stored;
		else if (stored) clearDraft(storageKey);
		draftReady = true;
	});

	$: currentSnapshot = serializeFields(draftFields(item));
	$: if (draftReady && !pendingDraft) scheduleDraft(currentSnapshot);

	function scheduleDraft(snapshot: string) {
		clearTimeout(draftTimer);
		draftTimer = setTimeout(() => {
			if (snapshot === baseline) clearDraft(storageKey);
			else saveDraft(storageKey, draftFields(item));
		}, 1000);
	}

	function restoreDraft() {
		if (!pendingDraft) return;
		const { fields } = pendingDraft;
		item = { ...item, ...fields, categories: [...fields.categories] };
		categoryText = item.categories.join(', ');
		slugManuallyEdited = true;
		editorKey += 1; // remount the rich text editor on the restored content
		pendingDraft = null;
	}

	function discardDraft() {
		clearDraft(storageKey);
		pendingDraft = null;
	}

	function formatDraftDate(timestamp: number): string {
		return new Intl.DateTimeFormat('it-IT', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		}).format(timestamp);
	}

	// enhance collects the form data before on:submit handlers run, so sync it here explicitly.
	const handleSave: SubmitFunction = ({ formData }) => {
		const metadata = buildMetadata();
		item.metadata = metadata;
		formData.set('content_html', item.contentHtml);
		formData.set('content_json', JSON.stringify(item.contentJson ?? null));
		formData.set('metadata', JSON.stringify(metadata));
		formData.set('legacy_content', item.legacyContent ?? '');
		const savedSnapshot = serializeFields(draftFields(item));
		return async ({ result, update }) => {
			if (result.type === 'success') {
				baseline = savedSnapshot;
				clearDraft(storageKey);
			}
			await update({ reset: false });
		};
	};

	onDestroy(() => clearTimeout(draftTimer));

	// ---------- Modes ----------
	type Mode = 'edit' | 'preview' | 'split';
	const SPLIT_KEY = 'da-editor-split';
	let mode: Mode = 'edit';
	let zen = false;
	let zenButton: HTMLButtonElement;

	onMount(() => {
		try {
			if (localStorage.getItem(SPLIT_KEY) === '1' && matchMedia('(min-width: 1200px)').matches)
				mode = 'split';
		} catch {
			// Preference unavailable.
		}
	});

	function toggleMode() {
		mode = mode === 'preview' ? 'edit' : 'preview';
	}

	function toggleSplit() {
		mode = mode === 'split' ? 'edit' : 'split';
		try {
			localStorage.setItem(SPLIT_KEY, mode === 'split' ? '1' : '0');
		} catch {
			// Preference unavailable.
		}
	}

	// The side preview follows the editor half a second after the last change.
	let previewItem: EditableContent = item;
	let previewTimer: ReturnType<typeof setTimeout> | undefined;
	$: if (mode === 'split') schedulePreview(currentSnapshot);
	$: if (mode === 'preview') previewItem = { ...item };

	function schedulePreview(snapshot: string) {
		void snapshot; // reactive trigger only
		clearTimeout(previewTimer);
		previewTimer = setTimeout(() => (previewItem = { ...item }), 500);
	}

	onDestroy(() => clearTimeout(previewTimer));

	// Side preview scrolls in proportion to how far the editor has been read.
	let previewPane: HTMLDivElement | undefined;
	let editorForm: HTMLFormElement | undefined;

	// Each side ignores the scroll events its own sync just caused.
	let ignorePreviewUntil = 0;
	let ignoreEditorUntil = 0;

	function scrollParent(node: HTMLElement): HTMLElement | null {
		for (let el = node.parentElement; el; el = el.parentElement) {
			const { overflowY } = getComputedStyle(el);
			if (/(auto|scroll)/.test(overflowY) && el.scrollHeight > el.clientHeight) return el;
		}
		return null;
	}

	function syncPreviewScroll(event?: Event) {
		if (mode !== 'split' || !previewPane || !editorForm) return;
		const now = performance.now();
		if (event?.target === previewPane) {
			// Preview scrolled by hand: move the editor in proportion.
			if (now < ignorePreviewUntil) return;
			const max = previewPane.scrollHeight - previewPane.clientHeight;
			if (max <= 0) return;
			const parent = scrollParent(editorForm);
			const viewport = parent ? parent.clientHeight : window.innerHeight;
			const range = editorForm.getBoundingClientRect().height - viewport;
			if (range <= 0) return;
			const delta = editorForm.getBoundingClientRect().top + (previewPane.scrollTop / max) * range;
			ignoreEditorUntil = now + 150;
			(parent ?? window).scrollBy({ top: delta, behavior: 'instant' });
			return;
		}
		if (now < ignoreEditorUntil) return;
		const rect = editorForm.getBoundingClientRect();
		const viewport = scrollParent(editorForm)?.clientHeight ?? window.innerHeight;
		const range = rect.height - viewport;
		const ratio = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
		ignorePreviewUntil = now + 150;
		previewPane.scrollTop = ratio * (previewPane.scrollHeight - previewPane.clientHeight);
	}

	function toggleZen() {
		zen = !zen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (zen && !coverStudioOpen && event.key === 'Escape') {
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

<svelte:window on:keydown={handleKeydown} on:scroll|capture={syncPreviewScroll} />

{#if coverStudioOpen}
	<CoverStudio
		bind:open={coverStudioOpen}
		title={item.title}
		description={item.description}
		categories={item.categories}
		initialSpec={coverEditing ? coverSpec : null}
		onuse={useGeneratedCover}
	/>
{/if}

<div class="zen-frame" class:active={zen}>
	<div class="action-bar">
		<div class="action-title">
			<span class="yr-badge" class:yr-badge--alert={isNewItem} class:yr-badge--solid={!isNewItem}
				>{isNewItem ? 'Nuovo' : 'Modifica'}</span
			>
			<span class="action-name" title={item.title}>{item.title || 'Senza titolo'}</span>
		</div>
		<div class="action-buttons">
			<button
				type="button"
				class="yr-button yr-button--ghost split-toggle"
				aria-pressed={mode === 'split'}
				on:click={toggleSplit}>{mode === 'split' ? 'Solo editor' : 'Affiancata'}</button
			>
			<button type="button" class="yr-button yr-button--ghost" on:click={toggleMode}>
				{mode === 'preview' ? 'Torna alla scrittura' : 'Anteprima'}
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

		{#if pendingDraft}
			<div class="draft-bar" role="alert">
				<p>
					Hai una bozza non salvata del <strong>{formatDraftDate(pendingDraft.savedAt)}</strong>.
				</p>
				<div class="draft-actions">
					<button type="button" class="yr-button yr-button--primary" on:click={restoreDraft}
						>Ripristina</button
					>
					<button type="button" class="yr-button yr-button--danger" on:click={discardDraft}
						>Scarta</button
					>
				</div>
			</div>
		{/if}

		<div class="layout" class:split={mode === 'split'}>
			{#if mode === 'preview' || mode === 'split'}
				<div
					class="preview-pane"
					bind:this={previewPane}
					class:side={mode === 'split'}
					aria-label="Anteprima dell'articolo"
				>
					<PostPreview item={previewItem} />
				</div>
			{/if}

			<form
				id={formId}
				bind:this={editorForm}
				method="POST"
				action="?/save"
				use:enhance={handleSave}
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
							<button
								type="button"
								class="yr-button cover-studio-open"
								on:click={() => openCoverStudio(false)}
								>{coverSpec ? 'Nuova copertina' : 'Crea copertina'}</button
							>
							{#if coverSpec}
								<button
									type="button"
									class="yr-button cover-studio-open"
									on:click={() => openCoverStudio(true)}>Modifica copertina</button
								>
							{/if}
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
											<label class="yr-label" for="gameImage">Immagine gioco (URL o percorso)</label
											>
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
													on:input={(event) =>
														updateReview('ratingValue', event.currentTarget.value)}
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
						{#key editorKey}
							<RichTextEditor bind:html={item.contentHtml} bind:json={item.contentJson} />
						{/key}
					</div>
				</section>
			</form>
		</div>
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

	/* Keeps the editor toolbar just under the sticky action bar. */
	.zen-frame {
		--editor-sticky-top: 3.6rem;
	}
	.zen-frame.active {
		--editor-sticky-top: 0px;
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
	.zen-frame.active .layout.split {
		max-width: min(120rem, 96vw);
		margin: 0 auto;
	}
	.zen-frame.active .layout.split form,
	.zen-frame.active .layout.split :global(.preview-pane) {
		max-width: none;
		margin: 0;
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

	.draft-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		margin: 0 0 1.25rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--automataColor);
		border-inline-start: 4px solid var(--automataRed);
		background-color: var(--yr-surface);
		box-shadow: var(--yr-shadow);
	}
	.draft-bar p {
		margin: 0;
	}
	.draft-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.split-toggle {
		display: none;
	}
	@media (min-width: 1200px) {
		.split-toggle {
			display: inline-flex;
		}
		.layout.split {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 1.25rem;
			align-items: start;
		}
		.layout.split .editor-form {
			order: 1;
		}
		.layout.split .preview-pane {
			order: 2;
			position: sticky;
			inset-block-start: 4.5rem;
			max-height: calc(100vh - 6rem);
			overflow-y: auto;
			overscroll-behavior: contain;
		}
		.layout.split .panel-row {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	/* Below the split breakpoint the side preview behaves like the normal editor. */
	@media (max-width: 1199px) {
		.preview-pane.side {
			display: none;
		}
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
