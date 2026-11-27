import { blockRenderers } from '#lib/blocks.ts';
import { escapeHtmlText as esc } from '#lib/rich-grading.ts';

/**
 * Blocchi di contenuto (fase 1): terminale, tldr, accordion, timeline, citazione, passi.
 * Ogni blocco è testo semplice in un blocco di codice: in lettura diventa HTML,
 * se non è valido resta codice. Un solo modello per tutti: `head` (opzioni e testi
 * singoli) e `items` (voci ripetute), così lo studio è generico.
 */
export type BlockModel = { head: Record<string, string>; items: Record<string, string>[] };

export type FieldDef = {
	key: string;
	label: string;
	type?: 'text' | 'area' | 'check' | 'select';
	options?: [value: string, label: string][];
	placeholder?: string;
};

export type BlockSpec = {
	language: string;
	/** Nome nel menu e nel titolo dello studio. */
	label: string;
	head: FieldDef[];
	itemFields: FieldDef[];
	itemLabel: string;
	minItems: number;
	maxItems: number;
	empty: () => BlockModel;
	parse: (source: string) => BlockModel | null;
	serialize: (model: BlockModel) => string;
	render: (model: BlockModel) => string;
};

const YES = 'sì';
const isYes = (value: string | undefined) => /^(s[iì]|true|1)$/i.test(value?.trim() ?? '');
const flag = (value: string | undefined) => (isYes(value) ? YES : 'no');
const oneLine = (value: string | undefined) => (value ?? '').replace(/\s*\n\s*/g, ' ').trim();
const cell = (value: string | undefined) => oneLine(value).replaceAll('|', '/');
const trimEnd = (lines: string[]) => {
	while (lines.length && !lines.at(-1)!.trim()) lines.pop();
	return lines;
};

/** Legge le righe `chiave: valore` in testa, ognuna una volta sola. */
function takeHeader(lines: string[], keys: string[]): Record<string, string> {
	const head: Record<string, string> = {};
	for (;;) {
		const match = lines[0]?.match(/^([a-zà-ù]+):[ \t]*(.*)$/i);
		const key = match?.[1].toLowerCase();
		if (!match || !key || !keys.includes(key) || key in head) return head;
		head[key] = match[2].trim();
		lines.shift();
	}
}

const splitLines = (source: string) => source.replace(/\r\n?/g, '\n').split('\n');
const paragraphs = (text: string) =>
	text
		.split(/\n\s*\n/)
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => `<p>${esc(part).replace(/\n/g, '<br>')}</p>`)
		.join('');

// ---------- Terminale ----------

const terminale: BlockSpec = {
	language: 'terminale',
	label: 'Terminale',
	head: [{ key: 'titolo', label: 'Titolo della finestra', placeholder: 'Terminale' }],
	itemFields: [
		{
			key: 'tipo',
			label: 'Tipo',
			type: 'select',
			options: [
				['cmd', 'Comando'],
				['out', 'Output']
			]
		},
		{ key: 'testo', label: 'Testo' }
	],
	itemLabel: 'riga',
	minItems: 1,
	maxItems: 200,
	empty: () => ({
		head: { titolo: '' },
		items: [
			{ tipo: 'cmd', testo: 'npm run dev' },
			{ tipo: 'out', testo: 'Server pronto su http://localhost:5173' }
		]
	}),
	parse(source) {
		const lines = splitLines(source);
		const head = takeHeader(lines, ['titolo']);
		const items = trimEnd(lines).map((line) =>
			line === '$' || line.startsWith('$ ')
				? { tipo: 'cmd', testo: line.slice(2) }
				: { tipo: 'out', testo: line }
		);
		return items.some((item) => item.tipo === 'cmd' || item.testo.trim())
			? { head: { titolo: head.titolo ?? '' }, items }
			: null;
	},
	serialize: ({ head, items }) =>
		[
			`titolo: ${oneLine(head.titolo)}`,
			...items.map(({ tipo, testo }) => {
				const text = (testo ?? '').replace(/\s*\n\s*/g, ' ').trimEnd();
				return tipo === 'cmd' ? `$ ${text}` : text.startsWith('$') ? ` ${text}` : text;
			})
		].join('\n'),
	render({ head, items }) {
		const lines = items
			.map((item) =>
				item.tipo === 'cmd'
					? `<div class="rich-terminale__cmd">${esc(item.testo)}</div>`
					: `<div class="rich-terminale__out">${esc(item.testo) || '&nbsp;'}</div>`
			)
			.join('');
		const hasCommands = items.some((item) => item.tipo === 'cmd');
		return (
			`<figure class="rich-terminale" data-rich-block="terminale">` +
			`<figcaption class="rich-terminale__bar"><span>${esc(head.titolo || 'Terminale')}</span>` +
			(hasCommands
				? `<button type="button" class="rich-terminale__copy" hidden>Copia comandi</button>`
				: '') +
			`</figcaption><div class="rich-terminale__body">${lines}</div></figure>`
		);
	}
};

// ---------- TL;DR ----------

const tldr: BlockSpec = {
	language: 'tldr',
	label: 'TL;DR',
	head: [{ key: 'titolo', label: 'Titolo', placeholder: 'In breve' }],
	itemFields: [{ key: 'testo', label: 'Punto' }],
	itemLabel: 'punto',
	minItems: 1,
	maxItems: 5,
	empty: () => ({
		head: { titolo: '' },
		items: [{ testo: '' }, { testo: '' }, { testo: '' }]
	}),
	parse(source) {
		const lines = splitLines(source);
		const head = takeHeader(lines, ['titolo']);
		const items: Record<string, string>[] = [];
		for (const line of lines) {
			if (!line.trim()) continue;
			const match = line.match(/^\s*[-*]\s+(.+)$/);
			if (!match) return null;
			items.push({ testo: match[1].trim() });
		}
		return items.length >= 1 && items.length <= 5
			? { head: { titolo: head.titolo ?? '' }, items }
			: null;
	},
	serialize: ({ head, items }) =>
		[
			`titolo: ${oneLine(head.titolo)}`,
			...items
				.map((item) => oneLine(item.testo))
				.filter(Boolean)
				.map((text) => `- ${text}`)
		].join('\n'),
	render: ({ head, items }) =>
		`<aside class="rich-tldr" data-rich-block="tldr"><p class="rich-tldr__title">${esc(head.titolo || 'In breve')}</p>` +
		`<ul>${items.map((item) => `<li>${esc(item.testo)}</li>`).join('')}</ul></aside>`
};

// ---------- Accordion ----------

const accordion: BlockSpec = {
	language: 'accordion',
	label: 'Accordion',
	head: [{ key: 'aperta', label: 'Prima voce aperta', type: 'check' }],
	itemFields: [
		{ key: 'titolo', label: 'Titolo' },
		{ key: 'testo', label: 'Testo', type: 'area' }
	],
	itemLabel: 'voce',
	minItems: 1,
	maxItems: 30,
	empty: () => ({ head: { aperta: 'no' }, items: [{ titolo: '', testo: '' }] }),
	parse(source) {
		const lines = splitLines(source);
		const head = takeHeader(lines, ['aperta']);
		const items: Record<string, string>[] = [];
		for (const line of lines) {
			const title = line.match(/^##[ \t]+(.+)$/);
			if (title) items.push({ titolo: title[1].trim(), testo: '' });
			else if (items.length) items.at(-1)!.testo += `${line}\n`;
			else if (line.trim()) return null;
		}
		for (const item of items) item.testo = item.testo.trim();
		return items.length ? { head: { aperta: flag(head.aperta) }, items } : null;
	},
	serialize: ({ head, items }) =>
		[
			`aperta: ${flag(head.aperta)}`,
			...items
				.filter((item) => oneLine(item.titolo))
				.map(
					(item) =>
						`## ${oneLine(item.titolo)}\n${(item.testo ?? '').replace(/^##[ \t]*/gm, '').trim()}`
				)
		].join('\n'),
	render: ({ head, items }) =>
		`<div class="rich-accordion" data-rich-block="accordion">` +
		items
			.map(
				(item, index) =>
					`<details${index === 0 && isYes(head.aperta) ? ' open' : ''}><summary>${esc(item.titolo)}</summary>` +
					`<div class="rich-accordion__body">${paragraphs(item.testo)}</div></details>`
			)
			.join('') +
		`</div>`
};

// ---------- Timeline ----------

const timeline: BlockSpec = {
	language: 'timeline',
	label: 'Timeline',
	head: [{ key: 'orizzontale', label: 'Orizzontale', type: 'check' }],
	itemFields: [
		{ key: 'data', label: 'Data', placeholder: '2024' },
		{ key: 'titolo', label: 'Titolo' },
		{ key: 'testo', label: 'Testo (facoltativo)', type: 'area' }
	],
	itemLabel: 'tappa',
	minItems: 1,
	maxItems: 30,
	empty: () => ({ head: { orizzontale: 'no' }, items: [{ data: '', titolo: '', testo: '' }] }),
	parse(source) {
		const lines = splitLines(source);
		const head = takeHeader(lines, ['orizzontale']);
		const items: Record<string, string>[] = [];
		for (const line of lines) {
			if (!line.trim()) continue;
			const [data, titolo, ...rest] = line.split('|').map((part) => part.trim());
			if (!data || !titolo) return null;
			items.push({ data, titolo, testo: rest.join(' | ') });
		}
		return items.length ? { head: { orizzontale: flag(head.orizzontale) }, items } : null;
	},
	serialize: ({ head, items }) =>
		[
			`orizzontale: ${flag(head.orizzontale)}`,
			...items
				.filter((item) => cell(item.data) && cell(item.titolo))
				.map(
					(item) =>
						`${cell(item.data)} | ${cell(item.titolo)}${oneLine(item.testo) ? ` | ${oneLine(item.testo)}` : ''}`
				)
		].join('\n'),
	render: ({ head, items }) =>
		`<ol class="rich-timeline${isYes(head.orizzontale) ? ' rich-timeline--orizzontale' : ''}" data-rich-block="timeline">` +
		items
			.map(
				(item) =>
					`<li><span class="rich-timeline__date">${esc(item.data)}</span>` +
					`<strong class="rich-timeline__title">${esc(item.titolo)}</strong>` +
					(item.testo ? `<p>${esc(item.testo)}</p>` : '') +
					`</li>`
			)
			.join('') +
		`</ol>`
};

// ---------- Citazione ----------

const safeLink = (value: string | undefined) =>
	/^https?:\/\/[^\s"'<>]+$/i.test(value?.trim() ?? '') ? value!.trim() : '';

const citazione: BlockSpec = {
	language: 'citazione',
	label: 'Citazione',
	head: [
		{ key: 'testo', label: 'Testo', type: 'area' },
		{ key: 'autore', label: 'Autore' },
		{ key: 'fonte', label: 'Fonte' },
		{ key: 'link', label: 'Link (facoltativo)', placeholder: 'https://' }
	],
	itemFields: [],
	itemLabel: '',
	minItems: 0,
	maxItems: 0,
	empty: () => ({ head: { testo: '', autore: '', fonte: '', link: '' }, items: [] }),
	parse(source) {
		const lines = splitLines(source);
		const head = takeHeader(lines, ['autore', 'fonte', 'link']);
		const testo = lines.join('\n').trim();
		return testo
			? {
					head: {
						testo,
						autore: head.autore ?? '',
						fonte: head.fonte ?? '',
						link: head.link ?? ''
					},
					items: []
				}
			: null;
	},
	serialize: ({ head }) =>
		[
			`autore: ${oneLine(head.autore)}`,
			`fonte: ${oneLine(head.fonte)}`,
			`link: ${oneLine(head.link)}`,
			(head.testo ?? '').trim()
		].join('\n'),
	render({ head }) {
		const link = safeLink(head.link);
		const source = head.fonte
			? link
				? `<cite><a href="${esc(link)}" target="_blank" rel="noopener noreferrer">${esc(head.fonte)}</a></cite>`
				: `<cite>${esc(head.fonte)}</cite>`
			: '';
		const credit = [head.autore ? `<span>${esc(head.autore)}</span>` : '', source]
			.filter(Boolean)
			.join(', ');
		return (
			`<figure class="rich-citazione" data-rich-block="citazione"><blockquote>${paragraphs(head.testo)}</blockquote>` +
			(credit ? `<figcaption>${credit}</figcaption>` : '') +
			`</figure>`
		);
	}
};

// ---------- Passi ----------

const hashText = (text: string) => {
	let hash = 5381;
	for (let index = 0; index < text.length; index++)
		hash = ((hash << 5) + hash + text.charCodeAt(index)) | 0;
	return (hash >>> 0).toString(36);
};

const passi: BlockSpec = {
	language: 'passi',
	label: 'Passi',
	head: [],
	itemFields: [
		{ key: 'titolo', label: 'Passo' },
		{ key: 'nota', label: 'Nota (facoltativa)' }
	],
	itemLabel: 'passo',
	minItems: 1,
	maxItems: 40,
	empty: () => ({ head: {}, items: [{ titolo: '', nota: '' }] }),
	parse(source) {
		const items: Record<string, string>[] = [];
		for (const line of splitLines(source)) {
			if (!line.trim()) continue;
			const [titolo, ...rest] = line.split('|').map((part) => part.trim());
			if (!titolo) return null;
			items.push({ titolo, nota: rest.join(' | ') });
		}
		return items.length ? { head: {}, items } : null;
	},
	serialize: ({ items }) =>
		items
			.filter((item) => cell(item.titolo))
			.map((item) => `${cell(item.titolo)}${oneLine(item.nota) ? ` | ${oneLine(item.nota)}` : ''}`)
			.join('\n'),
	render(model) {
		const key = hashText(passi.serialize(model));
		return (
			`<ol class="rich-passi" data-rich-block="passi" data-passi="${key}">` +
			model.items
				.map(
					(item, index) =>
						`<li><label><input type="checkbox" data-passo="${index}" disabled> <span>${esc(item.titolo)}</span></label>` +
						(item.nota ? `<p>${esc(item.nota)}</p>` : '') +
						`</li>`
				)
				.join('') +
			`</ol>`
		);
	}
};

export const contentBlocks: BlockSpec[] = [terminale, tldr, accordion, timeline, citazione, passi];

for (const spec of contentBlocks) {
	blockRenderers.set(spec.language, (source) => {
		const model = spec.parse(source);
		return model ? spec.render(model) : null;
	});
}

export const contentBlockFor = (language: string) =>
	contentBlocks.find((spec) => spec.language === language);

// ---------- Comportamento in lettura (solo browser) ----------

const storageKey = (key: string) => `yr-passi:${key}`;

function readChecked(key: string): number[] {
	try {
		const value: unknown = JSON.parse(localStorage.getItem(storageKey(key)) ?? '[]');
		return Array.isArray(value) ? value.filter((item) => Number.isInteger(item)) : [];
	} catch {
		return [];
	}
}

/** Rende attivi i blocchi che senza JavaScript restano statici: copia e spunte. */
export function enhanceBlocks(container: HTMLElement) {
	container
		.querySelectorAll<HTMLButtonElement>('.rich-terminale__copy')
		.forEach((button) => (button.hidden = false));
	container.querySelectorAll<HTMLElement>('.rich-passi[data-passi]').forEach((list) => {
		const done = readChecked(list.dataset.passi ?? '');
		list.querySelectorAll<HTMLInputElement>('input[data-passo]').forEach((box) => {
			box.checked = done.includes(Number(box.dataset.passo));
			box.disabled = false;
		});
	});
}

export function handleBlockClick(event: Event) {
	const button =
		event.target instanceof Element
			? event.target.closest<HTMLButtonElement>('.rich-terminale__copy')
			: null;
	if (!button) return;
	const commands = [
		...(button.closest('.rich-terminale')?.querySelectorAll('.rich-terminale__cmd') ?? [])
	]
		.map((line) => line.textContent ?? '')
		.join('\n');
	const label = button.textContent;
	void navigator.clipboard
		?.writeText(commands)
		.then(() => {
			button.textContent = 'Copiato';
			setTimeout(() => (button.textContent = label), 1500);
		})
		.catch(() => undefined);
}

export function handleBlockChange(event: Event) {
	const box = event.target instanceof HTMLInputElement ? event.target : null;
	const list = box?.closest<HTMLElement>('.rich-passi[data-passi]');
	if (!box || !list) return;
	const done = [...list.querySelectorAll<HTMLInputElement>('input[data-passo]')]
		.filter((item) => item.checked)
		.map((item) => Number(item.dataset.passo));
	try {
		localStorage.setItem(storageKey(list.dataset.passi ?? ''), JSON.stringify(done));
	} catch {
		// Senza storage le spunte valgono solo finché la pagina è aperta.
	}
}
