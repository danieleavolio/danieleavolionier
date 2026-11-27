<script lang="ts">
	import { untrack } from 'svelte';
	import { contentBlockFor, type BlockModel, type FieldDef } from '#lib/blocks-content.ts';
	import { blockCodeHtml } from '#lib/blocks.ts';
	import BlockStudio from './BlockStudio.svelte';
	import RichContent from './RichContent.svelte';

	/**
	 * Studio dei blocchi di contenuto (terminale, tldr, accordion, timeline,
	 * citazione, passi): i campi vengono dalla definizione in `blocks-content.ts`.
	 */
	let {
		kind,
		initial,
		apply,
		dismiss
	}: {
		kind: string;
		initial: BlockModel | null;
		apply: (source: string) => void;
		dismiss: () => void;
	} = $props();

	const spec = untrack(() => contentBlockFor(kind)!);
	const id = $props.id();
	let counter = 0;

	type Row = { key: number; values: Record<string, string> };
	const start = untrack(() => initial ?? spec.empty());
	let head = $state<Record<string, string>>({ ...start.head });
	let rows = $state<Row[]>(
		start.items.map((values) => ({ key: counter++, values: { ...values } }))
	);

	const model = $derived<BlockModel>({ head, items: rows.map((row) => row.values) });
	const source = $derived(spec.serialize(model));
	// Valido solo se il sorgente prodotto si rilegge: copre campi obbligatori e limiti.
	const valid = $derived(
		Boolean(spec.parse(source)) &&
			(spec.maxItems === 0 || (rows.length >= spec.minItems && rows.length <= spec.maxItems))
	);

	function addRow() {
		if (rows.length >= spec.maxItems) return;
		const values = Object.fromEntries(spec.itemFields.map((field) => [field.key, '']));
		if ('tipo' in values) values.tipo = rows.at(-1)?.values.tipo === 'cmd' ? 'out' : 'cmd';
		rows.push({ key: counter++, values });
	}

	function move(index: number, by: number) {
		const target = index + by;
		if (target < 0 || target >= rows.length) return;
		[rows[index], rows[target]] = [rows[target], rows[index]];
	}

	const fieldId = (scope: string, field: FieldDef) => `${id}-${scope}-${field.key}`;
</script>

{#snippet field(f: FieldDef, values: Record<string, string>, scope: string)}
	{#if f.type === 'check'}
		<label class="check">
			<input
				type="checkbox"
				checked={values[f.key] === 'sì'}
				onchange={(event) => (values[f.key] = event.currentTarget.checked ? 'sì' : 'no')}
			/>
			{f.label}
		</label>
	{:else if f.type === 'select'}
		<select aria-label={f.label} bind:value={values[f.key]}>
			{#each f.options ?? [] as [value, label] (value)}
				<option {value}>{label}</option>
			{/each}
		</select>
	{:else if f.type === 'area'}
		<textarea
			id={fieldId(scope, f)}
			aria-label={f.label}
			placeholder={f.label}
			rows="3"
			bind:value={values[f.key]}
		></textarea>
	{:else}
		<input
			id={fieldId(scope, f)}
			type="text"
			aria-label={f.label}
			placeholder={f.placeholder ?? f.label}
			bind:value={values[f.key]}
		/>
	{/if}
{/snippet}

<BlockStudio
	title={`Studio ${spec.label}`}
	submitLabel={initial ? `Aggiorna ${spec.label}` : `Inserisci ${spec.label}`}
	{valid}
	submit={() => apply(source)}
	{dismiss}
>
	{#snippet controls()}
		{#each spec.head as f (f.key)}
			{#if f.type === 'area' || f.type === 'check'}
				{@render field(f, head, 'head')}
			{:else}
				<label for={fieldId('head', f)}>{f.label}</label>
				{@render field(f, head, 'head')}
			{/if}
		{/each}

		{#if spec.itemFields.length}
			<fieldset>
				<legend>{spec.itemLabel[0].toUpperCase() + spec.itemLabel.slice(1)} ({rows.length})</legend>
				{#each rows as row, index (row.key)}
					<div class="item">
						<div class="fields">
							{#each spec.itemFields as f (f.key)}
								{@render field(f, row.values, String(row.key))}
							{/each}
						</div>
						<div class="actions">
							<button
								type="button"
								aria-label={`Sposta su: ${spec.itemLabel} ${index + 1}`}
								disabled={index === 0}
								onclick={() => move(index, -1)}>↑</button
							>
							<button
								type="button"
								aria-label={`Sposta giù: ${spec.itemLabel} ${index + 1}`}
								disabled={index === rows.length - 1}
								onclick={() => move(index, 1)}>↓</button
							>
							<button
								type="button"
								aria-label={`Rimuovi: ${spec.itemLabel} ${index + 1}`}
								disabled={rows.length <= spec.minItems}
								onclick={() => (rows = rows.filter((r) => r.key !== row.key))}>✕</button
							>
						</div>
					</div>
				{/each}
				<button type="button" disabled={rows.length >= spec.maxItems} onclick={addRow}
					>+ Aggiungi {spec.itemLabel}</button
				>
			</fieldset>
		{/if}
	{/snippet}

	{#snippet preview()}
		{#if valid}
			<RichContent html={blockCodeHtml(spec.language, source)} />
		{:else}
			<p>Compila i campi obbligatori per vedere il blocco.</p>
		{/if}
	{/snippet}
</BlockStudio>

<style>
	fieldset {
		display: grid;
		gap: 0.5rem;
		min-inline-size: 0;
		margin: 0;
		padding: 0.5rem;
		border: 1px solid var(--yr-line-strong);
	}

	fieldset > button {
		justify-self: start;
	}

	.item {
		display: flex;
		gap: 0.4rem;
		align-items: start;
		padding-block-end: 0.5rem;
		border-block-end: 1px dashed var(--yr-line-strong);
	}

	.fields {
		display: grid;
		flex: 1 1 auto;
		gap: 0.3rem;
		min-inline-size: 0;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
