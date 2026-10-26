<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import PostPreview from '$lib/components/PostPreview.svelte';
	import type { EditableContent } from '$lib/server/admin-content';

	export let item: EditableContent;
	export let form;

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

	function syncReview() {
		item.metadata = buildMetadata();
	}

	let mode: 'edit' | 'preview' = 'edit';
	let zen = false;

	function toggleMode() {
		mode = mode === 'edit' ? 'preview' : 'edit';
	}

	function toggleZen() {
		zen = !zen;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (zen && event.key === 'Escape') {
			zen = false;
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
		<button type="button" on:click={toggleZen}>{zen ? 'Esci da Zen' : 'Zen'}</button>
	</div>

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
			<input id="title" name="title" bind:value={item.title} on:input={handleTitleInput} required />

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
			<input id="categories" name="categories" value={item.categories.join(', ')} />

			<label for="image">Immagine di copertina (URL o percorso)</label>
			<input
				id="image"
				name="image"
				type="text"
				placeholder="https://... oppure /images/..."
				bind:value={item.image}
			/>

			<label class="checkbox"
				><input type="checkbox" name="published" value="true" bind:checked={item.published} /> Pubblicato</label
			>

			{#if item.metadata.contentType === 'posts'}
				<fieldset>
					<legend>Metadati recensione</legend>
					<label class="checkbox"
						><input
							type="checkbox"
							bind:checked={review.isReview}
							on:change={(event) => updateReview('isReview', event.currentTarget.checked)}
						/> È una recensione</label
					>
					{#if review.isReview}
						<label for="gameName">Nome gioco</label>
						<input id="gameName" bind:value={review.gameName} on:input={syncReview} />
						<label for="gameImage">Immagine gioco (URL o percorso)</label>
						<input
							id="gameImage"
							type="text"
							placeholder="https://... oppure /images/..."
							bind:value={review.gameImage}
							on:input={syncReview}
						/>
						<label for="ratingValue">Voto</label>
						<input
							id="ratingValue"
							type="number"
							min="0"
							max="10"
							step="0.1"
							bind:value={review.ratingValue}
							on:input={syncReview}
						/>
						<label for="developer">Sviluppatore</label>
						<input id="developer" bind:value={review.developer} on:input={syncReview} />
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
		z-index: 80;
		background: var(--automataBg);
		overflow-y: auto;
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
		border: 1px solid var(--automataColor);
		background: var(--automataBg);
	}

	.editor-form {
		display: grid;
		gap: 0.6rem;
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
