<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import RichContent from '#lib/components/RichContent.svelte';
	import {
		chartCodeBlock,
		chartDataSource,
		chartPalette,
		chartSource,
		defaultChartThickness,
		parseChart,
		type ChartDatum,
		type ChartSettings
	} from '#lib/bar-chart.ts';

	let {
		initial,
		apply,
		dismiss
	}: {
		initial: ChartSettings | null;
		apply: (source: string) => void;
		dismiss: () => void;
	} = $props();

	const id = $props.id();
	const customDefault = '#4d493e';
	let dialog: HTMLDialogElement;
	const defaults: ChartSettings = {
		title: '',
		unit: '',
		type: 'colonne',
		thickness: defaultChartThickness,
		color: '',
		wide: false,
		data: ''
	};
	const startingSettings = untrack(() => initial ?? defaults);
	let settings = $state({ ...startingSettings });
	let colorMode = $state(
		startingSettings.color.startsWith('#') ? 'custom' : startingSettings.color
	);
	let customColor = $state(
		startingSettings.color.startsWith('#') ? startingSettings.color : customDefault
	);

	type DraftRow = { id: number; label: string; value: string; mode: string; custom: string };
	let nextId = 0;
	const palette = Object.entries(chartPalette);
	function newRow(
		{ label, value, color }: ChartDatum = { label: '', value: '', color: '' }
	): DraftRow {
		return {
			id: nextId++,
			label,
			value,
			mode: color.startsWith('#') ? 'custom' : color,
			custom: color.startsWith('#') ? color : customDefault
		};
	}

	const initialRows = parseChart(chartSource(startingSettings))?.rows;
	let rows = $state(initialRows?.map(newRow) ?? [newRow()]);
	const activeRows = $derived(rows.filter((row) => row.label.trim() || row.value.trim()));
	const completeRows = $derived(
		activeRows.filter((row) => row.label.trim() && /^\d+(?:[.,]\d+)?$/.test(row.value.trim()))
	);
	const source = $derived(
		chartSource({
			...settings,
			color: colorMode === 'custom' ? customColor : colorMode,
			data: chartDataSource(
				completeRows.map(({ label, value, mode, custom }) => ({
					label,
					value,
					color: mode === 'custom' ? custom : mode
				}))
			)
		})
	);
	const previewReady = $derived(Boolean(parseChart(source)));
	const valid = $derived(previewReady && completeRows.length === activeRows.length);

	onMount(() => dialog.showModal());

	function loadExample() {
		settings = {
			...settings,
			title: 'Quanto si aspetta se un deploy dura 15 minuti',
			unit: 'min'
		};
		rows = [
			newRow({ label: '1 deploy', value: '15', color: 'rosso' }),
			newRow({ label: '2 deploy', value: '30', color: 'bianco' }),
			newRow({ label: '3 deploy', value: '45', color: 'giallo' })
		];
	}

	function commit() {
		if (!valid) return;
		apply(source);
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={`${id}-heading`}
	onclose={dismiss}
	onkeydown={(event) => event.stopPropagation()}
>
	<header class="studio-header">
		<h2 id={`${id}-heading`}>Studio grafici</h2>
		<button type="button" onclick={() => dialog.close()}>Annulla</button>
	</header>

	<div class="studio-grid">
		<div class="controls">
			<label>
				Titolo del grafico
				<input form="" bind:value={settings.title} maxlength="120" />
			</label>
			<div class="settings-row">
				<div class="field">
					<label for={`${id}-type`}>Tipo di grafico</label>
					<select id={`${id}-type`} form="" bind:value={settings.type}>
						<option value="colonne">Colonne</option>
						<option value="barre">Barre orizzontali</option>
						<option value="linea">Linea</option>
					</select>
				</div>
				<label>
					Unità (facoltativa)
					<input form="" bind:value={settings.unit} maxlength="16" placeholder="min, €, kg…" />
				</label>
			</div>
			<div class="settings-row">
				<div class="field">
					<label for={`${id}-color`}>Colore base</label>
					<select id={`${id}-color`} form="" bind:value={colorMode}>
						<option value="">Automatico (segue il tema)</option>
						{#each palette as [key, color] (key)}
							<option value={key}>{color.name}</option>
						{/each}
						<option value="custom">Personalizzato</option>
					</select>
				</div>
				{#if colorMode === 'custom'}
					<label>
						Colore personalizzato
						<input type="color" form="" bind:value={customColor} />
					</label>
				{/if}
			</div>
			<label>
				Spessore: {settings.thickness}%
				<input form="" type="range" min="10" max="100" step="1" bind:value={settings.thickness} />
			</label>
			<label class="check">
				<input form="" type="checkbox" bind:checked={settings.wide} />
				Larghezza piena (occupa tutta la colonna)
			</label>
			<div class="data-rows">
				{#each rows as row, index (row.id)}
					<fieldset class="datum">
						<legend>Dato {index + 1}</legend>
						<label>
							Etichetta
							<input form="" bind:value={row.label} maxlength="120" />
						</label>
						<label>
							Valore
							<input form="" inputmode="decimal" bind:value={row.value} maxlength="32" />
						</label>
						<div class="field datum-color">
							<label for={`${id}-item-${row.id}`}>Colore</label>
							<select id={`${id}-item-${row.id}`} form="" bind:value={row.mode}>
								<option value="">Colore base</option>
								{#each palette as [key, color] (key)}
									<option value={key}>{color.name}</option>
								{/each}
								<option value="custom">Personalizzato</option>
							</select>
							{#if row.mode === 'custom'}
								<input
									type="color"
									form=""
									aria-label={`Colore personalizzato, dato ${index + 1}`}
									bind:value={row.custom}
								/>
							{/if}
						</div>
						{#if rows.length > 1}
							<button
								class="remove-row"
								type="button"
								aria-label={`Rimuovi dato ${index + 1}`}
								onclick={() => (rows = rows.filter((item) => item.id !== row.id))}>×</button
							>
						{/if}
					</fieldset>
				{/each}
			</div>
			<button
				class="example"
				type="button"
				disabled={rows.length >= 24}
				onclick={() => rows.push(newRow())}
			>
				Aggiungi dato
			</button>
			<p>Fino a 24 valori non negativi. Per i decimali puoi usare la virgola o il punto.</p>
			{#if completeRows.length !== activeRows.length}
				<p role="status">Controlla etichetta e valore delle righe incomplete.</p>
			{/if}
			{#if !initial && !settings.title.trim() && !activeRows.length}
				<button class="example" type="button" onclick={loadExample}>Usa l’esempio dei deploy</button
				>
			{/if}
		</div>

		<section class="studio-preview" aria-label="Anteprima del grafico">
			<h3>Anteprima in tempo reale</h3>
			{#if previewReady}
				<RichContent html={chartCodeBlock(source)} />
			{:else}
				<p>Scrivi un titolo e almeno un dato valido per vedere il grafico.</p>
			{/if}
		</section>
	</div>

	<footer>
		<button class="primary" type="button" disabled={!valid} onclick={commit}>
			{initial ? 'Aggiorna grafico' : 'Inserisci grafico'}
		</button>
	</footer>
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		inline-size: min(68rem, calc(100vw - 1.5rem));
		max-block-size: calc(100dvh - 1.5rem);
		margin: auto;
		padding: clamp(0.75rem, 2.5vw, 1.5rem);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBg);
	}

	dialog::backdrop {
		background: rgb(21 21 18 / 65%);
	}

	.studio-header,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.65rem;
	}

	.studio-header h2,
	.studio-preview h3 {
		margin: 0;
		font-family: var(--font-mono);
	}

	.studio-grid {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
		gap: 1rem;
		margin-block: 1rem;
	}

	.controls,
	.settings-row,
	.data-rows,
	.field,
	label {
		display: grid;
		gap: 0.5rem;
	}

	.settings-row {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.field,
	label {
		min-inline-size: 0;
	}

	label {
		font-weight: 600;
	}

	.datum {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(3rem, 0.7fr) minmax(0, 1.4fr) auto;
		gap: 0.4rem;
		align-items: start;
		min-inline-size: 0;
		margin: 0;
		padding: 0.35rem 0.55rem 0.55rem;
		border: 1px solid var(--yr-line-strong);
	}

	.datum legend {
		padding-inline: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.datum .remove-row {
		align-self: end;
		margin: 0;
	}

	input,
	select {
		box-sizing: border-box;
		inline-size: 100%;
		min-inline-size: 0;
		color: inherit;
	}

	input:not([type='range']),
	select {
		padding: 0.4rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		background: var(--automataBg);
	}

	input[type='color'] {
		min-block-size: 2.25rem;
	}

	input[type='range'] {
		accent-color: var(--yr-accent);
	}

	p {
		margin: 0;
		font-size: 0.9rem;
	}

	.studio-preview {
		position: sticky;
		inset-block-start: 0;
		align-self: start;
		min-inline-size: 0;
		padding: 0.75rem;
		border: 1px solid var(--yr-line-strong);
	}

	.studio-preview h3 {
		margin-block-end: 0.75rem;
		font-size: 1rem;
	}

	button {
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		box-shadow: none;
		color: inherit;
		background: var(--automataBg);
	}

	.example {
		justify-self: start;
	}

	footer {
		justify-content: end;
	}

	.primary {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.primary:disabled {
		opacity: 0.5;
	}

	@media (max-width: 740px) {
		.studio-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.studio-preview {
			position: static;
		}
	}
</style>
