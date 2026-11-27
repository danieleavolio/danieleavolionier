<script lang="ts">
	import { untrack } from 'svelte';
	import BlockStudio from '#lib/components/BlockStudio.svelte';
	import RichContent from '#lib/components/RichContent.svelte';
	import { parseHighlight, serializeHighlight, type HighlightMode } from '#lib/table-highlight.ts';

	/** Studio dell'evidenziazione: scelta per colonna tra ignora, più alto o più basso è meglio. */
	let {
		html,
		columns,
		initial,
		apply,
		dismiss
	}: {
		/** La tabella com'è nell'editor (senza evidenziazione). */
		html: string;
		/** Intestazioni delle colonne. */
		columns: string[];
		initial: string | null;
		/** Riceve il valore di `data-hl`, o null per togliere l'evidenziazione. */
		apply: (value: string | null) => void;
		dismiss: () => void;
	} = $props();

	const saved = untrack(() => parseHighlight(initial));
	let enabled = $state(Boolean(saved));
	let modes = $state<HighlightMode[]>(
		untrack(() => columns.map((_, index) => saved?.[index] ?? '+'))
	);
	const value = $derived(enabled ? serializeHighlight(modes) : null);
	const previewHtml = $derived.by(() => {
		const box = document.createElement('div');
		box.innerHTML = html;
		const table = box.querySelector('table');
		if (table && value) table.setAttribute('data-hl', value);
		return box.innerHTML;
	});
</script>

<BlockStudio
	title="Evidenzia la tabella"
	previewLabel="Anteprima"
	submitLabel="Applica"
	valid={!enabled || value !== null}
	submit={() => apply(value)}
	{dismiss}
>
	{#snippet controls()}
		<label class="check">
			<input form="" type="checkbox" bind:checked={enabled} />
			Evidenzia miglior e peggior valore di ogni colonna
		</label>
		{#if enabled}
			{#each columns as name, index (index)}
				<label>
					{name.trim() || `Colonna ${index + 1}`}
					<select form="" bind:value={modes[index]}>
						<option value="+">Più alto è meglio</option>
						<option value="-">Più basso è meglio</option>
						<option value="0">Ignora</option>
					</select>
				</label>
			{/each}
			<p>
				Conta solo la colonna con numeri (anche come 1.234,5, 12 %, 120 ms). Le colonne di testo
				restano com’erano.
			</p>
		{/if}
	{/snippet}
	{#snippet preview()}
		<RichContent html={previewHtml} />
	{/snippet}
</BlockStudio>

<style>
	label {
		display: grid;
		gap: 0.4rem;
		font-weight: 600;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	select {
		box-sizing: border-box;
		inline-size: 100%;
		padding: 0.4rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: inherit;
		background: var(--automataBg);
	}

	p {
		margin: 0;
		font-size: 0.9rem;
	}
</style>
