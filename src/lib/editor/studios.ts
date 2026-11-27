import type { Component } from 'svelte';
import { parseChart } from '#lib/bar-chart.ts';
import { contentBlocks } from '#lib/blocks-content.ts';
import ChartStudio from '#lib/components/ChartStudio.svelte';
import ContentStudio from '#lib/components/ContentStudio.svelte';
import MermaidStudio from '#lib/components/MermaidStudio.svelte';

/**
 * Studi visuali dei blocchi: un blocco di codice con `language` si apre nello
 * studio corrispondente. Ogni studio riceve `initial`, `apply(source)` e `dismiss`.
 * Per un nuovo blocco basta aggiungere una voce qui (più la voce `/` e il pulsante).
 */
export type StudioDef = {
	language: string;
	/** Etichetta del pulsante "modifica" sopra il blocco. */
	editLabel: string;
	component: Component<{
		initial: never;
		apply: (source: string) => void;
		dismiss: () => void;
	}>;
	/** Stato iniziale dello studio dal sorgente; null se non è modificabile. */
	initial: (source: string) => unknown;
	/** Proprietà fisse per lo studio (es. il tipo di blocco di `ContentStudio`). */
	props?: Record<string, unknown>;
};

export const studios: StudioDef[] = [
	{
		language: 'bar-chart',
		editLabel: 'Modifica grafico',
		component: ChartStudio as unknown as StudioDef['component'],
		initial: parseChart
	},
	{
		language: 'mermaid',
		editLabel: 'Modifica diagramma',
		component: MermaidStudio as unknown as StudioDef['component'],
		initial: (source) => (source.trim() ? source : null)
	},
	...contentBlocks.map((spec) => ({
		language: spec.language,
		editLabel: `Modifica ${spec.label}`,
		component: ContentStudio as unknown as StudioDef['component'],
		initial: spec.parse,
		props: { kind: spec.language }
	}))
];

export const studioFor = (language: string) =>
	studios.find((studio) => studio.language === language);
