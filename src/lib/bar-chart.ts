import { escapeHtmlText } from '#lib/rich-grading.ts';

const chartBlock = /<pre\b[^>]*>\s*<code\b([^>]*)>([^<]*)<\/code>\s*<\/pre>/gi;
const namedEntities: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: '\u00a0'
};

function decodeCodeText(value: string): string {
	return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, key: string) => {
		if (!key.startsWith('#')) return namedEntities[key] ?? entity;
		const hex = key[1].toLowerCase() === 'x';
		const point = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
		return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
	});
}

export const chartTypes = ['barre', 'colonne', 'linea'] as const;
export const defaultChartThickness = 60;
export const chartPalette = {
	rosso: { name: 'Rosso YoRHa', token: 'var(--automataRed)' },
	bianco: { name: 'Bianco YoRHa', token: 'var(--automataWhite)' },
	giallo: { name: 'Giallo YoRHa', token: 'var(--automataYellow)' },
	nero: { name: 'Nero YoRHa', token: 'var(--automataBlackO)' }
} as const;
const colorPattern = new RegExp(`^(?:${Object.keys(chartPalette).join('|')}|#[\\da-f]{6})$`, 'i');
const isPaletteColor = (color: string): color is keyof typeof chartPalette =>
	Object.hasOwn(chartPalette, color);
const colorCss = (color: string) => (isPaletteColor(color) ? chartPalette[color].token : color);

export type ChartSettings = {
	title: string;
	unit: string;
	type: (typeof chartTypes)[number];
	thickness: number;
	color: string;
	data: string;
};

export type ChartDatum = { label: string; value: string; color: string };
type ChartRow = ChartDatum & { amount: number; display: string };
const chartRow = /^(.+)\|\s*(\d+(?:[.,]\d+)?)(?:\s*\|\s*([^|]+))?$/;

export function chartDataSource(data: ChartDatum[]): string {
	return data
		.map(({ label, value, color }) =>
			[label.trim(), value.trim(), ...(color ? [color] : [])].join(' | ')
		)
		.join('\n');
}

export function chartSource({ title, unit, type, thickness, color, data }: ChartSettings): string {
	return [
		`titolo: ${title.trim()}`,
		unit.trim() && `unità: ${unit.trim()}`,
		type !== 'barre' && `tipo: ${type}`,
		thickness !== defaultChartThickness && `spessore: ${thickness}`,
		color && `colore: ${color}`,
		data.trim()
	]
		.filter(Boolean)
		.join('\n');
}

export function chartCodeBlock(source: string): string {
	return `<pre><code class="language-bar-chart">${escapeHtmlText(source)}</code></pre>`;
}

export function parseChart(source: string): (ChartSettings & { rows: ChartRow[] }) | null {
	if (source.length > 8_000) return null;
	const lines = source
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
	const title = lines.shift()?.match(/^titolo\s*:\s*(.+)$/i)?.[1];
	if (!title || title.length > 120) return null;

	let unit = '';
	let type: ChartSettings['type'] = 'barre';
	let thickness = defaultChartThickness;
	let color = '';
	const settings = new Set<string>();
	while (lines.length) {
		if (chartRow.test(lines[0])) break;
		const option = lines[0].match(/^(unit[àa]|tipo|spessore|colore)\s*:\s*(.*)$/i);
		if (!option) break;
		const key = option[1].toLowerCase().replace('à', 'a');
		const value = option[2];
		if (settings.has(key)) return null;
		settings.add(key);
		switch (key) {
			case 'unita':
				if (value.length > 16) return null;
				unit = value;
				break;
			case 'tipo':
				if (!chartTypes.some((candidate) => candidate === value)) return null;
				type = value as ChartSettings['type'];
				break;
			case 'spessore':
				thickness = Number(value);
				if (!/^\d{2,3}$/.test(value) || thickness < 10 || thickness > 100) return null;
				break;
			case 'colore':
				if (!colorPattern.test(value)) return null;
				color = value.toLowerCase();
				break;
		}
		lines.shift();
	}

	if (lines.length < 1 || lines.length > 24) return null;
	const rows: ChartRow[] = [];
	for (const line of lines) {
		const match = line.match(chartRow);
		if (!match) return null;
		const label = match[1].trim();
		const value = match[2];
		const color = match[3]?.trim().toLowerCase() ?? '';
		const amount = Number(value.replace(',', '.'));
		if (!label || label.length > 120 || !Number.isFinite(amount)) return null;
		if (match[3] && !colorPattern.test(color)) return null;
		const display = [value.replace('.', ','), unit].filter(Boolean).join(' ');
		rows.push({ label, value, color, amount, display });
	}

	return { title, unit, type, thickness, color, data: lines.join('\n'), rows };
}

function renderChart(source: string): string | null {
	const chart = parseChart(source);
	if (!chart) return null;
	const { title, type, thickness, color, rows } = chart;
	const max = Math.max(...rows.map(({ amount }) => amount)) || 1;
	const percentages = rows.map(({ amount }) => (amount / max) * 100);
	const list = rows
		.map(({ label, display, color: itemColor }, i) => {
			const value = percentages[i].toFixed(3);
			const mark = type === 'linea' ? 'point' : 'bar';
			const paint = itemColor ? `;--chart-item-color:${colorCss(itemColor)}` : '';
			return `<li class="rich-bar-chart__row"><div class="rich-bar-chart__labels"><span>${escapeHtmlText(label)}</span><strong>${escapeHtmlText(display)}</strong></div><div class="rich-bar-chart__track" aria-hidden="true"><div class="rich-bar-chart__${mark}" style="--bar-width:${value}%${paint}"></div></div></li>`;
		})
		.join('');
	const labels = `<ul class="rich-bar-chart__rows" role="list">${list}</ul>`;
	const points = percentages
		.map((value, i) => `${i * 100 + 50},${(100 - value).toFixed(3)}`)
		.join(' ');
	const line =
		type === 'linea'
			? `<svg class="rich-bar-chart__line" viewBox="0 0 ${rows.length * 100} 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}" vector-effect="non-scaling-stroke"/></svg>`
			: '';
	const body =
		type === 'barre'
			? labels
			: `<div class="rich-bar-chart__scroll" tabindex="0" role="region" aria-label="Area del grafico"><div class="rich-bar-chart__plot" style="--chart-count:${rows.length}">${line}${labels}</div></div>`;
	const variant = type === 'barre' ? '' : ` rich-bar-chart--${type}`;
	const style = [
		thickness !== defaultChartThickness &&
			`--chart-weight:${thickness}%;--chart-track:${((thickness / defaultChartThickness) * 0.65).toFixed(3)}rem;--chart-stroke:${(thickness / 20).toFixed(2)}px`,
		color && `--chart-color:${colorCss(color)}`
	]
		.filter(Boolean)
		.join(';');
	return `<figure class="rich-bar-chart yr-panel${variant}"${style ? ` style="${style}"` : ''}><figcaption class="rich-bar-chart__title yr-panel__head">${escapeHtmlText(title)}</figcaption>${body}</figure>`;
}

/** Replace validated Markdown fences with static charts, leaving invalid input visible as code. */
export function renderBarCharts(html: string): string {
	return html.replace(chartBlock, (block, attributes: string, source: string) => {
		// Entities make the escaped source longer than its decoded text.
		if (source.length > 48_000) return block;
		const classes = attributes.match(/(?:^|\s)class\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
		if (!(classes?.[1] ?? classes?.[2])?.split(/\s+/).includes('language-bar-chart')) return block;
		return renderChart(decodeCodeText(source)) ?? block;
	});
}
