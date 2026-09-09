<script lang="ts">
	import { enhance } from '$app/forms';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
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

	function syncReview() {
		item.metadata = buildMetadata();
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

<form method="POST" action="?/save" use:enhance class="editor-form" on:submit={syncForm}>
	<h1>{item.slug ? 'Modifica contenuto' : 'Nuovo contenuto'}</h1>
	<input type="hidden" name="content_html" value={item.contentHtml} />
	<input type="hidden" name="content_json" value={JSON.stringify(item.contentJson ?? null)} />
	<input type="hidden" name="metadata" value={JSON.stringify(item.metadata ?? {})} />
	<input type="hidden" name="legacy_content" value={item.legacyContent ?? ''} />

	<label for="title">Titolo</label>
	<input id="title" name="title" bind:value={item.title} required />

	<label for="slug">Slug</label>
	<input id="slug" name="slug" bind:value={item.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required />

	<label for="description">Descrizione</label>
	<textarea id="description" name="description" bind:value={item.description} required></textarea>

	<label for="date">Data</label>
	<input id="date" name="date" type="date" bind:value={item.date} required />

	<label for="categories">Categorie separate da virgola</label>
	<input id="categories" name="categories" value={item.categories.join(', ')} />

	<label for="image">Immagine di copertina (URL)</label>
	<input id="image" name="image" type="url" bind:value={item.image} />

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
				<label for="gameImage">Immagine gioco (URL)</label>
				<input id="gameImage" type="url" bind:value={review.gameImage} on:input={syncReview} />
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

<style>
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

	.message {
		padding: 0.75rem;
		background: var(--automataBgRGBA);
	}
</style>
