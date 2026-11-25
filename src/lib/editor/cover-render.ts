export type CoverTemplate = 'pannello' | 'titolo' | 'quadrato';
export type CoverTheme = 'chiaro' | 'scuro';

/** A palette name ('ink', 'red', …) or a custom `#rrggbb`. */
export type CoverColor = string;
export type CoverBar = { label: string; value: string; color: CoverColor };
export type CoverStepKind =
	| 'box'
	| 'database'
	| 'dollar'
	| 'check'
	| 'arrow'
	| 'cross'
	| 'warning'
	| 'user'
	| 'server'
	| 'cloud'
	| 'file'
	| 'folder'
	| 'gear'
	| 'mail'
	| 'lock'
	| 'clock'
	| 'code'
	| 'chart'
	| 'globe'
	| 'bolt'
	| 'search';
export type CoverStep = { label: string; kind: CoverStepKind; color: CoverColor };

export const coverStepKinds: { value: CoverStepKind; label: string }[] = [
	{ value: 'box', label: 'Riquadro' },
	{ value: 'database', label: 'Database' },
	{ value: 'dollar', label: 'Dollaro' },
	{ value: 'check', label: 'Spunta' },
	{ value: 'cross', label: 'Croce' },
	{ value: 'warning', label: 'Attenzione' },
	{ value: 'arrow', label: 'Freccia' },
	{ value: 'user', label: 'Utente' },
	{ value: 'server', label: 'Server' },
	{ value: 'cloud', label: 'Cloud' },
	{ value: 'file', label: 'File' },
	{ value: 'folder', label: 'Cartella' },
	{ value: 'gear', label: 'Ingranaggio' },
	{ value: 'mail', label: 'Email' },
	{ value: 'lock', label: 'Lucchetto' },
	{ value: 'clock', label: 'Orologio' },
	{ value: 'code', label: 'Codice' },
	{ value: 'chart', label: 'Grafico' },
	{ value: 'globe', label: 'Mondo' },
	{ value: 'bolt', label: 'Fulmine' },
	{ value: 'search', label: 'Lente' }
];

/** Colours offered by the studio, with their hex per theme. */
export const coverSwatches: { value: string; label: string; chiaro: string; scuro: string }[] = [
	{ value: 'ink', label: 'Inchiostro', chiaro: '#4d493e', scuro: '#b4af9a' },
	{ value: 'red', label: 'Rosso', chiaro: '#cd674d', scuro: '#cd664d' },
	{ value: 'ocra', label: 'Ocra', chiaro: '#a9822f', scuro: '#d1ad5a' },
	{ value: 'oliva', label: 'Oliva', chiaro: '#69753f', scuro: '#a3b074' },
	{ value: 'blu', label: 'Blu', chiaro: '#47697a', scuro: '#7fa6b8' }
];

export function resolveCoverColor(theme: CoverTheme, color: CoverColor): string {
	if (/^#[0-9a-f]{6}$/i.test(color)) return color;
	return (coverSwatches.find((swatch) => swatch.value === color) ?? coverSwatches[0])[theme];
}

export type CoverSpec = {
	template: CoverTemplate;
	theme: CoverTheme;
	eyebrow: string;
	title: string;
	subtitle: string;
	panelTitle: string;
	panelText: string;
	bars: CoverBar[];
	flow: CoverStep[];
	tags: string;
	footer: string;
};

export const coverTemplates: { value: CoverTemplate; label: string; size: string }[] = [
	{ value: 'pannello', label: 'Pannello', size: '1600×900' },
	{ value: 'titolo', label: 'Solo titolo', size: '1600×900' },
	{ value: 'quadrato', label: 'Quadrato', size: '1080×1080' }
];

export const coverSizes: Record<CoverTemplate, { width: number; height: number }> = {
	pannello: { width: 1600, height: 900 },
	titolo: { width: 1600, height: 900 },
	quadrato: { width: 1080, height: 1080 }
};

export function defaultCoverSpec(
	input: { title?: string; description?: string; categories?: string[] } = {}
): CoverSpec {
	return {
		template: 'pannello',
		theme: 'chiaro',
		eyebrow: 'Archivio // Blog',
		title: input.title?.trim() ?? '',
		subtitle: input.description?.trim() ?? '',
		panelTitle: '',
		panelText: '',
		bars: [],
		flow: [],
		tags: (input.categories ?? []).slice(0, 3).join(', '),
		footer: 'danieleavolio.it'
	};
}

const sans = "'Manrope', 'Noto Sans', 'Segoe UI', sans-serif";
const mono = "'JetBrains Mono', 'Cascadia Mono', Consolas, monospace";

const palettes = {
	chiaro: {
		bg: '#c8c2aa',
		surface: '#d6d0b8',
		ink: '#3f3d36',
		accent: '#4d493e',
		red: '#cd674d',
		line: 'rgba(77, 73, 62, 0.45)',
		grid: 'rgba(77, 73, 62, 0.07)',
		shadow: 'rgba(77, 73, 62, 0.18)'
	},
	scuro: {
		bg: '#2e2c26',
		surface: '#3a3832',
		ink: '#d1cdb7',
		accent: '#b4af9a',
		red: '#cd664d',
		line: 'rgba(180, 175, 154, 0.45)',
		grid: 'rgba(209, 205, 183, 0.06)',
		shadow: 'rgba(0, 0, 0, 0.35)'
	}
} as const;

type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };

/** Loads the webfonts the cover uses so the canvas does not fall back. */
export async function loadCoverFonts(): Promise<void> {
	if (typeof document === 'undefined' || !document.fonts) return;
	try {
		await document.fonts.ready;
		await Promise.all([
			document.fonts.load(`300 64px ${sans}`, 'Aa'),
			document.fonts.load(`600 64px ${sans}`, 'Aa'),
			document.fonts.load(`400 18px ${mono}`, 'Aa')
		]);
	} catch {
		// Fall back to whatever is installed.
	}
}

function setFont(ctx: Ctx, weight: number, size: number, family: string) {
	ctx.font = `${weight} ${size}px ${family}`;
}

const hasSpacing = (ctx: Ctx) => typeof ctx.letterSpacing === 'string';

/** Width of the text including tracking, without the trailing tracking. */
function textWidth(ctx: Ctx, text: string, spacing: number): number {
	if (!text) return 0;
	if (hasSpacing(ctx)) {
		ctx.letterSpacing = `${spacing}px`;
		const width = ctx.measureText(text).width - spacing;
		ctx.letterSpacing = '0px';
		return width;
	}
	let total = 0;
	for (const char of text) total += ctx.measureText(char).width + spacing;
	return total - spacing;
}

function drawText(ctx: Ctx, text: string, x: number, y: number, spacing: number) {
	if (hasSpacing(ctx)) {
		ctx.letterSpacing = `${spacing}px`;
		ctx.fillText(text, x, y);
		ctx.letterSpacing = '0px';
		return;
	}
	let cursor = x;
	for (const char of text) {
		ctx.fillText(char, cursor, y);
		cursor += ctx.measureText(char).width + spacing;
	}
}

function fitText(ctx: Ctx, text: string, maxWidth: number, spacing: number): string {
	if (textWidth(ctx, text, spacing) <= maxWidth) return text;
	let cut = text;
	while (cut.length > 1 && textWidth(ctx, `${cut}…`, spacing) > maxWidth) cut = cut.slice(0, -1);
	return `${cut.trimEnd()}…`;
}

type Word = { text: string; bold: boolean };

/** Splits the title into words, marking the ones between `**` as bold. */
function parseTitle(source: string): Word[][] {
	return source.split('\n').map((line) => {
		const words: Word[] = [];
		let bold = false;
		for (const part of line.split('**')) {
			for (const word of part.split(/\s+/).filter(Boolean)) {
				words.push({ text: word.toLocaleUpperCase('it-IT'), bold });
			}
			bold = !bold;
		}
		return words;
	});
}

type TitleLayout = { size: number; lines: Word[][]; fits: boolean };

function layoutTitle(
	ctx: Ctx,
	source: string,
	maxWidth: number,
	maxHeight: number,
	maxSize: number
): TitleLayout {
	const paragraphs = parseTitle(source);
	let last: TitleLayout = { size: 24, lines: [], fits: false };
	for (let size = maxSize; size >= 24; size -= 2) {
		const spacing = size * 0.047;
		const space = () => {
			setFont(ctx, 300, size, sans);
			return textWidth(ctx, ' ', spacing) + spacing * 2;
		};
		const gap = space();
		const wordWidth = (word: Word) => {
			setFont(ctx, word.bold ? 600 : 300, size, sans);
			return textWidth(ctx, word.text, spacing);
		};
		const lines: Word[][] = [];
		let tooWide = false;
		for (const words of paragraphs) {
			let current: Word[] = [];
			let width = 0;
			for (const word of words) {
				const w = wordWidth(word);
				if (w > maxWidth) tooWide = true;
				if (current.length && width + gap + w > maxWidth) {
					lines.push(current);
					current = [];
					width = 0;
				}
				width += (current.length ? gap : 0) + w;
				current.push(word);
			}
			if (current.length) lines.push(current);
		}
		last = { size, lines, fits: !tooWide && lines.length * size * 1.12 <= maxHeight };
		if (last.fits) return last;
	}
	return last;
}

function wrapSubtitle(ctx: Ctx, text: string, maxWidth: number, spacing: number, maxLines: number) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let current = '';
	for (const word of words) {
		const next = current ? `${current} ${word}` : word;
		if (current && textWidth(ctx, next, spacing) > maxWidth) {
			lines.push(current);
			current = word;
		} else current = next;
	}
	if (current) lines.push(current);
	if (lines.length > maxLines) {
		const kept = lines.slice(0, maxLines);
		kept[maxLines - 1] = fitText(
			ctx,
			`${kept[maxLines - 1]} ${lines[maxLines]}…`,
			maxWidth,
			spacing
		);
		return kept;
	}
	return lines.map((line) => fitText(ctx, line, maxWidth, spacing));
}

/** Keeps spaces and breaks, wraps a line only when it is too long. */
function wrapMono(ctx: Ctx, text: string, maxWidth: number): string[] {
	const charWidth = ctx.measureText('M').width;
	const maxChars = Math.max(8, Math.floor(maxWidth / charWidth));
	const lines: string[] = [];
	for (const raw of text.replace(/\t/g, '  ').split('\n')) {
		let rest = raw.replace(/\s+$/, '');
		if (!rest) {
			lines.push('');
			continue;
		}
		while (rest.length > maxChars) {
			const space = rest.lastIndexOf(' ', maxChars);
			const at = space > maxChars * 0.5 ? space : maxChars;
			lines.push(rest.slice(0, at).replace(/\s+$/, ''));
			rest = rest.slice(at).replace(/^ /, '');
		}
		lines.push(rest);
	}
	while (lines.length && !lines[lines.length - 1]) lines.pop();
	return lines;
}

type Bar = { label: string; value: number; shown: string; color: string };

function parseBars(rows: CoverBar[], theme: CoverTheme): Bar[] {
	const bars: Bar[] = [];
	for (const row of rows) {
		const label = row.label.trim();
		const shown = row.value.trim();
		const value = Number(shown.replace(',', '.'));
		if (!label || !shown || !Number.isFinite(value) || value < 0) continue;
		bars.push({ label, value, shown, color: resolveCoverColor(theme, row.color) });
	}
	return bars;
}

type Step = { label: string; kind: CoverStepKind; color: string };

function parseFlow(rows: CoverStep[], theme: CoverTheme): Step[] {
	return rows
		.filter((row) => row.label.trim())
		.map((row) => ({
			label: row.label.trim(),
			kind: row.kind,
			color: resolveCoverColor(theme, row.color)
		}));
}

type Palette = (typeof palettes)[CoverTheme];

type PanelSpec = {
	title: string;
	text: string;
	flow: Step[];
	bars: Bar[];
};

const nodeW = 112;
const nodeGap = 38;
const nodeRowH = 104;

/** Draws one step icon centred on (cx, cy), in a 52px square. */
export function drawStepIcon(
	ctx: Ctx,
	step: { kind: CoverStepKind; color: string },
	index: number,
	cx: number,
	cy: number
) {
	const half = 26;
	ctx.save();
	ctx.translate(cx, cy);
	ctx.strokeStyle = step.color;
	ctx.fillStyle = step.color;
	ctx.lineWidth = 3;
	ctx.lineJoin = 'miter';
	ctx.lineCap = 'butt';
	const line = (...pts: number[]) => {
		ctx.beginPath();
		ctx.moveTo(pts[0], pts[1]);
		for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
		ctx.stroke();
	};
	const circle = (x: number, y: number, r: number, fill = false) => {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		if (fill) ctx.fill();
		else ctx.stroke();
	};
	const label = (text: string, size: number, dy = 1) => {
		setFont(ctx, 600, size, mono);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, 0, dy);
		ctx.textAlign = 'left';
	};
	const frame = () => ctx.strokeRect(-half + 2, -half + 2, half * 2 - 4, half * 2 - 4);
	switch (step.kind) {
		case 'database': {
			const rx = 22;
			const ry = 7;
			const top = -half + ry + 2;
			const bottom = half - ry - 2;
			ctx.beginPath();
			ctx.ellipse(0, top, rx, ry, 0, 0, Math.PI * 2);
			ctx.moveTo(-rx, top);
			ctx.lineTo(-rx, bottom);
			ctx.ellipse(0, bottom, rx, ry, 0, Math.PI, 0, true);
			ctx.lineTo(rx, top);
			ctx.stroke();
			ctx.beginPath();
			ctx.ellipse(0, (top + bottom) / 2, rx, ry, 0, 0, Math.PI);
			ctx.stroke();
			break;
		}
		case 'dollar':
			circle(0, 0, half - 2);
			label('$', 30, 2);
			break;
		case 'check':
			frame();
			line(-12, 0, -3, 10, 13, -10);
			break;
		case 'cross':
			frame();
			line(-11, -11, 11, 11);
			line(11, -11, -11, 11);
			break;
		case 'warning':
			ctx.lineJoin = 'round';
			line(0, -23, 24, 20, -24, 20, 0, -23);
			line(0, -9, 0, 6);
			circle(0, 13, 2, true);
			break;
		case 'arrow':
			line(-half + 2, 0, half - 4, 0);
			ctx.beginPath();
			ctx.moveTo(half - 2, 0);
			ctx.lineTo(half - 14, -9);
			ctx.lineTo(half - 14, 9);
			ctx.closePath();
			ctx.fill();
			break;
		case 'user':
			circle(0, -9, 9);
			ctx.beginPath();
			ctx.arc(0, 26, 20, Math.PI * 1.18, Math.PI * 1.82);
			ctx.stroke();
			break;
		case 'server':
			for (const y of [-22, -4, 14]) {
				ctx.strokeRect(-22, y, 44, 14);
				circle(-14, y + 7, 2, true);
			}
			break;
		case 'cloud':
			ctx.lineJoin = 'round';
			ctx.beginPath();
			ctx.moveTo(-14, 14);
			ctx.arc(-14, 4, 10, Math.PI / 2, Math.PI * 1.5);
			ctx.arc(-2, -6, 12, Math.PI, Math.PI * 1.85);
			ctx.arc(14, 3, 11, Math.PI * 1.5, Math.PI / 2);
			ctx.closePath();
			ctx.stroke();
			break;
		case 'file':
			line(-15, -24, 5, -24, 17, -12, 17, 24, -15, 24, -15, -24);
			line(5, -24, 5, -12, 17, -12);
			line(-8, 0, 10, 0);
			line(-8, 9, 10, 9);
			break;
		case 'folder':
			line(-24, 20, -24, -16, -8, -16, -2, -9, 24, -9, 24, 20, -24, 20);
			break;
		case 'gear': {
			circle(0, 0, 7);
			for (let i = 0; i < 8; i++) {
				const t = (i * Math.PI) / 4;
				line(Math.cos(t) * 14, Math.sin(t) * 14, Math.cos(t) * 23, Math.sin(t) * 23);
			}
			circle(0, 0, 15);
			break;
		}
		case 'mail':
			ctx.strokeRect(-23, -15, 46, 30);
			line(-23, -15, 0, 3, 23, -15);
			break;
		case 'lock':
			ctx.strokeRect(-16, -4, 32, 26);
			ctx.beginPath();
			ctx.arc(0, -4, 10, Math.PI, 0);
			ctx.stroke();
			circle(0, 9, 3, true);
			break;
		case 'clock':
			circle(0, 0, half - 2);
			line(0, -14, 0, 0, 10, 6);
			break;
		case 'code':
			line(-8, -14, -22, 0, -8, 14);
			line(8, -14, 22, 0, 8, 14);
			line(4, -18, -4, 18);
			break;
		case 'chart':
			line(-22, -22, -22, 22, 22, 22);
			ctx.fillRect(-14, 4, 9, 14);
			ctx.fillRect(-1, -6, 9, 24);
			ctx.fillRect(12, -16, 9, 34);
			break;
		case 'globe':
			circle(0, 0, half - 2);
			ctx.beginPath();
			ctx.ellipse(0, 0, 10, half - 2, 0, 0, Math.PI * 2);
			ctx.stroke();
			line(-(half - 2), 0, half - 2, 0);
			break;
		case 'bolt':
			ctx.lineJoin = 'round';
			ctx.beginPath();
			ctx.moveTo(6, -25);
			ctx.lineTo(-14, 3);
			ctx.lineTo(-1, 3);
			ctx.lineTo(-6, 25);
			ctx.lineTo(14, -3);
			ctx.lineTo(1, -3);
			ctx.closePath();
			ctx.stroke();
			break;
		case 'search':
			circle(-5, -5, 14);
			line(5, 5, 22, 22);
			break;
		default:
			frame();
			label(String(index + 1).padStart(2, '0'), 18);
	}
	ctx.restore();
	ctx.lineWidth = 1;
}

function flowPerRow(innerW: number): number {
	return Math.max(1, Math.floor((innerW + nodeGap) / (nodeW + nodeGap)));
}

function drawPanel(
	ctx: Ctx,
	p: Palette,
	panel: PanelSpec,
	x: number,
	y: number,
	width: number,
	maxHeight: number
): number {
	const headH = panel.title ? 46 : 0;
	const padX = 24;
	const padY = 22;
	const innerW = width - padX * 2;
	const rowH = 34;
	const barsH = panel.bars.length ? panel.bars.length * rowH : 0;
	const flowH = panel.flow.length
		? Math.ceil(panel.flow.length / flowPerRow(innerW)) * nodeRowH
		: 0;

	let fontSize = 19;
	let lines: string[] = [];
	let height = 0;
	for (; fontSize >= 10; fontSize -= 1) {
		setFont(ctx, 400, fontSize, mono);
		lines = panel.text ? wrapMono(ctx, panel.text, innerW) : [];
		const textH = lines.length * fontSize * 1.55;
		const sections = (lines.length ? 1 : 0) + (flowH ? 1 : 0) + (barsH ? 1 : 0);
		const gaps = Math.max(0, sections - 1) * 14;
		height = headH + padY * 2 + textH + flowH + gaps + barsH - (barsH ? 6 : 0);
		if (height <= maxHeight) break;
	}
	height = Math.min(height, maxHeight);

	ctx.fillStyle = p.shadow;
	ctx.fillRect(x + 6, y + 6, width, height);
	ctx.fillStyle = p.surface;
	ctx.fillRect(x, y, width, height);
	ctx.strokeStyle = p.line;
	ctx.lineWidth = 1;
	ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

	if (panel.title) {
		ctx.fillStyle = p.accent;
		ctx.fillRect(x, y, width, headH);
		ctx.fillStyle = p.bg;
		ctx.fillRect(x + 18, y + headH / 2 - 5.5, 11, 11);
		setFont(ctx, 400, 17, mono);
		ctx.textBaseline = 'middle';
		const label = fitText(
			ctx,
			`01 // ${panel.title}`.toLocaleUpperCase('it-IT'),
			width - 18 - 11 - 12 - 18,
			5
		);
		drawText(ctx, label, x + 18 + 11 + 12, y + headH / 2 + 1, 5);
	}

	ctx.fillStyle = p.ink;
	ctx.textBaseline = 'middle';
	setFont(ctx, 400, fontSize, mono);
	const lineH = fontSize * 1.55;
	let cy = y + headH + padY;
	for (const line of lines) {
		ctx.fillText(line, x + padX, cy + lineH / 2);
		cy += lineH;
	}
	if (lines.length && (flowH || barsH)) cy += 14;

	if (panel.flow.length) {
		const perRow = flowPerRow(innerW);
		ctx.textBaseline = 'middle';
		panel.flow.forEach((step, i) => {
			const col = i % perRow;
			const row = Math.floor(i / perRow);
			const nx = x + padX + col * (nodeW + nodeGap);
			const ny = cy + row * nodeRowH;
			const cx = nx + nodeW / 2;
			drawStepIcon(ctx, step, i, cx, ny + 30);
			ctx.textBaseline = 'middle';
			setFont(ctx, 400, 15, mono);
			ctx.fillStyle = step.color === p.accent ? p.ink : step.color;
			ctx.textAlign = 'center';
			const maxChars = Math.floor(nodeW / ctx.measureText('M').width);
			const rows: string[] = [];
			let current = '';
			for (const word of step.label.split(/\s+/)) {
				const next = current ? `${current} ${word}` : word;
				if (current && next.length > maxChars) {
					rows.push(current);
					current = word;
				} else current = next;
			}
			rows.push(current);
			rows.slice(0, 2).forEach((text, k) => {
				ctx.fillText(fitText(ctx, text, nodeW + 8, 0), cx, ny + 72 + k * 18);
			});
			ctx.textAlign = 'left';
			// Arrow towards the next step on the same row.
			if (col < perRow - 1 && i < panel.flow.length - 1) {
				const from = nx + nodeW - 14;
				const to = from + nodeGap + 14;
				const ay = ny + 30;
				ctx.strokeStyle = p.accent;
				ctx.fillStyle = p.accent;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(from + 4, ay);
				ctx.lineTo(to - 8, ay);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(to, ay);
				ctx.lineTo(to - 9, ay - 6);
				ctx.lineTo(to - 9, ay + 6);
				ctx.closePath();
				ctx.fill();
				ctx.lineWidth = 1;
			}
		});
		cy += flowH + (barsH ? 14 : 0);
	}

	if (panel.bars.length) {
		setFont(ctx, 400, 18, mono);
		const max = Math.max(...panel.bars.map((bar) => bar.value), 1e-9);
		const labelW = Math.min(
			innerW * 0.38,
			Math.max(...panel.bars.map((bar) => ctx.measureText(bar.label).width))
		);
		const valueW = Math.max(...panel.bars.map((bar) => ctx.measureText(bar.shown).width));
		const trackX = x + padX + labelW + 14;
		const trackW = Math.max(20, innerW - labelW - valueW - 28);
		for (const bar of panel.bars) {
			const mid = cy + rowH / 2;
			ctx.fillStyle = p.ink;
			ctx.textAlign = 'left';
			ctx.fillText(fitText(ctx, bar.label, labelW, 0), x + padX, mid);
			const w = Math.max(2, (bar.value / max) * trackW);
			ctx.fillStyle = bar.color;
			ctx.fillRect(trackX, mid - 8, w, 16);
			ctx.fillStyle = bar.color === p.accent ? p.ink : bar.color;
			ctx.fillText(bar.shown, trackX + w + 14, mid);
			cy += rowH;
		}
	}
	return height;
}

export function renderCover(canvas: HTMLCanvasElement, spec: CoverSpec): void {
	const { width: W, height: H } = coverSizes[spec.template];
	if (canvas.width !== W) canvas.width = W;
	if (canvas.height !== H) canvas.height = H;
	const ctx = canvas.getContext('2d') as Ctx | null;
	if (!ctx) return;
	const p = palettes[spec.theme];
	const m = spec.template === 'quadrato' ? 72 : 64;

	ctx.clearRect(0, 0, W, H);
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'left';

	// Background with the 8px grid.
	ctx.fillStyle = p.bg;
	ctx.fillRect(0, 0, W, H);
	ctx.fillStyle = p.grid;
	for (let x = 0; x < W; x += 8) ctx.fillRect(x, 0, 1, H);
	for (let y = 0; y < H; y += 8) ctx.fillRect(0, y, W, 1);

	// Header: bullet, label, rule and dots.
	ctx.fillStyle = p.ink;
	ctx.fillRect(m, 57, 12, 12);
	setFont(ctx, 400, 18, mono);
	drawText(ctx, 'DANIELE AVOLIO // LOG', m + 26, 64, 6);
	ctx.fillRect(m, 94, W - m * 2, 3);
	for (let x = m + 6; x < W - m; x += 22) {
		ctx.beginPath();
		ctx.arc(x, 105, 1.7, 0, Math.PI * 2);
		ctx.fill();
	}

	// Footer: dashed separator, tags and site name.
	const footY = H - 77;
	ctx.strokeStyle = p.line;
	ctx.lineWidth = 1;
	ctx.setLineDash([5, 4]);
	ctx.beginPath();
	ctx.moveTo(m, footY + 0.5);
	ctx.lineTo(W - m, footY + 0.5);
	ctx.stroke();
	ctx.setLineDash([]);
	const footMid = H - 54;
	setFont(ctx, 400, 16, mono);
	const footer = spec.footer.trim().toLocaleUpperCase('it-IT');
	const footerW = textWidth(ctx, footer, 4);
	ctx.fillStyle = p.ink;
	drawText(ctx, footer, W - m - footerW, footMid, 4);
	const tags = spec.tags
		.split(',')
		.map((tag) => tag.trim())
		.filter(Boolean)
		.join(' · ')
		.toLocaleUpperCase('it-IT');
	if (tags) {
		ctx.fillStyle = p.red;
		ctx.fillRect(m, footMid - 5.5, 11, 11);
		ctx.fillStyle = p.ink;
		const room = W - m * 2 - footerW - 24 - 21;
		drawText(ctx, fitText(ctx, tags, room, 4), m + 21, footMid, 4);
	}

	const top = 148;
	const bottom = footY - 30;
	const contentH = bottom - top;
	const panel: PanelSpec = {
		title: spec.panelTitle.trim(),
		text: spec.panelText.replace(/\s+$/, ''),
		flow: parseFlow(spec.flow, spec.theme),
		bars: parseBars(spec.bars, spec.theme)
	};
	const hasPanel =
		spec.template !== 'titolo' &&
		Boolean(panel.title || panel.text.trim() || panel.bars.length || panel.flow.length);
	const textless = !spec.title.trim() && !spec.subtitle.trim() && !spec.eyebrow.trim();
	const sideBySide = spec.template === 'pannello' && hasPanel && !textless;
	const gap = 36;
	const textW = sideBySide ? (W - m * 2 - gap) / 2 : W - m * 2;

	// Text block: eyebrow, title, subtitle.
	const eyebrow = spec.eyebrow.trim().toLocaleUpperCase('it-IT');
	const eyebrowH = eyebrow ? 36 : 0;
	setFont(ctx, 400, 20, mono);
	const subtitle = spec.subtitle.trim()
		? wrapSubtitle(ctx, spec.subtitle.trim(), textW, 2, spec.template === 'titolo' ? 3 : 4)
		: [];
	const subH = subtitle.length ? subtitle.length * 32 + 26 : 0;
	const titleBudget = spec.template === 'quadrato' && hasPanel ? contentH * 0.46 : contentH;
	const maxSize = spec.template === 'titolo' ? 124 : spec.template === 'quadrato' ? 76 : 72;
	const title = layoutTitle(ctx, spec.title, textW, titleBudget - eyebrowH - subH, maxSize);
	const titleH = title.lines.length * title.size * 1.12;
	const blockH = eyebrowH + titleH + subH;

	let y = top;
	if (spec.template === 'titolo' || (!hasPanel && spec.template !== 'quadrato')) {
		y = top + Math.max(0, (contentH - blockH) / 2);
	}
	const blockTop = y;

	if (eyebrow) {
		setFont(ctx, 400, 20, mono);
		ctx.globalAlpha = 0.55;
		ctx.fillStyle = p.ink;
		drawText(ctx, eyebrow, m, y + 12, 3);
		ctx.globalAlpha = 1;
		y += eyebrowH;
	}
	ctx.fillStyle = p.ink;
	const lineH = title.size * 1.12;
	const spacing = title.size * 0.047;
	for (const line of title.lines) {
		let x = m;
		const cy = y + lineH / 2;
		for (const word of line) {
			setFont(ctx, word.bold ? 600 : 300, title.size, sans);
			drawText(ctx, word.text, x, cy, spacing);
			x += textWidth(ctx, word.text, spacing);
			setFont(ctx, 300, title.size, sans);
			x += textWidth(ctx, ' ', spacing) + spacing * 2;
		}
		y += lineH;
	}
	if (subtitle.length) {
		y += 26;
		setFont(ctx, 400, 20, mono);
		for (const line of subtitle) {
			drawText(ctx, line, m, y + 16, 2);
			y += 32;
		}
	}

	if (!hasPanel) return;
	if (textless) {
		// Flow-only cover: draw the panel larger and centred in the free area.
		const k = 1.6;
		const w = (W - m * 2 - 6) / k;
		const probe = document.createElement('canvas').getContext('2d') as Ctx;
		const h = drawPanel(probe, p, panel, 0, 0, w, (contentH - 6) / k);
		ctx.save();
		ctx.translate(m, top + Math.max(0, (contentH - 6 - h * k) / 2));
		ctx.scale(k, k);
		drawPanel(ctx, p, panel, 0, 0, w, (contentH - 6) / k);
		ctx.restore();
	} else if (sideBySide) {
		drawPanel(ctx, p, panel, m + textW + gap, top, textW, contentH - 6);
	} else {
		const panelTop = Math.max(blockTop + blockH + 40, top);
		drawPanel(ctx, p, panel, m, panelTop, W - m * 2 - 6, bottom - panelTop - 6);
	}
}
