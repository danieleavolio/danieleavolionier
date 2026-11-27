<script lang="ts">
	import { untrack } from 'svelte';
	import BlockStudio from '#lib/components/BlockStudio.svelte';
	import RichContent from '#lib/components/RichContent.svelte';
	import { glossaryMarkup, glossaryPreviewHtml } from '#lib/glossary.ts';

	/** Studio del glossario: un termine e la sua definizione, scritti come `[[termine|definizione]]`. */
	let {
		term: initialTerm,
		apply,
		dismiss
	}: {
		/** Testo selezionato nell'editor (può essere vuoto). */
		term: string;
		/** Riceve il sorgente `[[termine|definizione]]` da scrivere al posto della selezione. */
		apply: (source: string) => void;
		dismiss: () => void;
	} = $props();

	let term = $state(untrack(() => initialTerm));
	let definition = $state('');
	const source = $derived(glossaryMarkup(term, definition));
	const previewHtml = $derived(
		glossaryPreviewHtml(
			'Nel testo, ',
			source ? term : 'termine',
			source ? definition : 'definizione',
			' compare così: passa il mouse o tocca la parola.'
		)
	);
</script>

<BlockStudio
	title="Definizione nel testo"
	submitLabel="Inserisci"
	valid={source !== null}
	submit={() => source && apply(source)}
	{dismiss}
>
	{#snippet controls()}
		<label>
			Termine
			<input form="" bind:value={term} maxlength="80" />
		</label>
		<label>
			Definizione
			<textarea form="" rows="4" maxlength="400" bind:value={definition}></textarea>
		</label>
		<p>
			Niente parentesi quadre o barre verticali. Nell’editor resta visibile come
			<code>[[termine|definizione]]</code>; nell’articolo è la parola sottolineata con il tooltip.
		</p>
	{/snippet}
	{#snippet preview()}
		<RichContent html={previewHtml} />
	{/snippet}
</BlockStudio>
