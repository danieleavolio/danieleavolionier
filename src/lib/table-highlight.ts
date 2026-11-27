/**
 * Evidenziazione dei valori nelle tabelle: l'attributo `data-hl` della tabella
 * elenca, per colonna, `+` (più alto è meglio), `-` (più basso è meglio) o `0`
 * (ignora). In lettura il valore migliore prende l'accento e il peggiore il rosso.
 * Senza JavaScript la tabella resta una tabella normale.
 */
export type HighlightMode = '+' | '-' | '0';

const modes = new Set<string>(['+', '-', '0']);

/** Legge `+,-,0`; null se vuoto o con voci non valide. */
export function parseHighlight(value: string | null | undefined): HighlightMode[] | null {
	if (!value) return null;
	const list = value.split(',').map((item) => item.trim());
	if (list.length > 40 || !list.every((item) => modes.has(item))) return null;
	return list.includes('+') || list.includes('-') ? (list as HighlightMode[]) : null;
}

export function serializeHighlight(list: HighlightMode[]): string | null {
	return list.includes('+') || list.includes('-') ? list.join(',') : null;
}

/** Numero da una cella: `1.234,5`, `12,5 %`, `€ 1.200`, `120 ms`. Null se non è un numero. */
export function parseCellNumber(text: string): number | null {
	const match = text.trim().match(/^[^\d+\-−]{0,3}\s*([+\-−]?\d[\d.,]*)\s*[^\d\s.,]{0,5}$/u);
	if (!match) return null;
	let raw = match[1].replace('−', '-');
	if (raw.includes(',')) {
		if (raw.indexOf(',') !== raw.lastIndexOf(',')) return null;
		raw = raw.replace(/\./g, '').replace(',', '.');
	} else if (/^[+-]?\d{1,3}(?:\.\d{3})+$/.test(raw)) {
		raw = raw.replace(/\./g, '');
	}
	const value = Number(raw);
	return Number.isFinite(value) ? value : null;
}

/** Marca migliore e peggiore di ogni colonna numerica configurata. Idempotente. */
export function highlightTables(container: HTMLElement) {
	container.querySelectorAll<HTMLTableElement>('table[data-hl]').forEach((table) => {
		table
			.querySelectorAll('.rich-hl-best, .rich-hl-worst')
			.forEach((cell) => cell.classList.remove('rich-hl-best', 'rich-hl-worst'));
		const config = parseHighlight(table.dataset.hl);
		if (!config) return;
		const rows = [...table.rows];
		if (rows[0] && [...rows[0].cells].every((cell) => cell.tagName === 'TH')) rows.shift();
		config.forEach((mode, column) => {
			if (mode === '0') return;
			const cells = rows.flatMap((row) => (row.cells[column] ? [row.cells[column]] : []));
			const filled = cells.filter((cell) => cell.textContent?.trim());
			const numbers = filled.map((cell) => ({
				cell,
				value: parseCellNumber(cell.textContent ?? '')
			}));
			const valid = numbers.filter(
				(item): item is { cell: HTMLTableCellElement; value: number } => item.value !== null
			);
			// Colonna testuale (o quasi): niente evidenziazione.
			if (valid.length < 2 || valid.length < filled.length / 2) return;
			const values = valid.map((item) => item.value);
			const high = Math.max(...values);
			const low = Math.min(...values);
			if (high === low) return;
			const [best, worst] = mode === '+' ? [high, low] : [low, high];
			for (const { cell, value } of valid) {
				if (value === best) cell.classList.add('rich-hl-best');
				else if (value === worst) cell.classList.add('rich-hl-worst');
			}
		});
	});
}
