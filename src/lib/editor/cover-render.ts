export type CoverTemplate = 'pannello' | 'titolo' | 'quadrato';
export type CoverTheme = 'chiaro' | 'scuro';

export type CoverSpec = {
	template: CoverTemplate;
	theme: CoverTheme;
	eyebrow: string;
	title: string;
	subtitle: string;
	panelTitle: string;
	panelText: string;
	bars: string;
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
		bars: '',
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

type Bar = { label: string; value: number; shown: string; red: boolean };

function parseBars(source: string): Bar[] {
	const bars: Bar[] = [];
	for (const line of source.split('\n')) {
		const [label = '', shown = '', color = ''] = line.split('|').map((part) => part.trim());
		const value = Number(shown.replace(',', '.'));
		if (!label || !shown || !Number.isFinite(value) || value < 0) continue;
		bars.push({ label, value, shown, red: /^(rosso|red)$/i.test(color) });
	}
	return bars;
}

type Palette = (typeof palettes)[CoverTheme];

type PanelSpec = {
	title: string;
	text: string;
	bars: Bar[];
};

function drawPanel(
	ctx: Ctx,
	p: Palette,
	panel: PanelSpec,
	x: number,
	y: number,
	width: number,
	maxHeight: number
) {
	const headH = panel.title ? 46 : 0;
	const padX = 24;
	const padY = 22;
	const innerW = width - padX * 2;
	const rowH = 34;
	const barsH = panel.bars.length ? panel.bars.length * rowH : 0;

	let fontSize = 19;
	let lines: string[] = [];
	let height = 0;
	for (; fontSize >= 10; fontSize -= 1) {
		setFont(ctx, 400, fontSize, mono);
		lines = panel.text ? wrapMono(ctx, panel.text, innerW) : [];
		const textH = lines.length * fontSize * 1.55;
		const between = lines.length && barsH ? 14 : 0;
		height = headH + padY * 2 + textH + between + barsH - (barsH ? 6 : 0);
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
	if (lines.length && barsH) cy += 14;

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
			ctx.fillStyle = bar.red ? p.red : p.accent;
			ctx.fillRect(trackX, mid - 8, w, 16);
			ctx.fillStyle = bar.red ? p.red : p.ink;
			ctx.fillText(bar.shown, trackX + w + 14, mid);
			cy += rowH;
		}
	}
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
		bars: parseBars(spec.bars)
	};
	const hasPanel =
		spec.template !== 'titolo' && Boolean(panel.title || panel.text.trim() || panel.bars.length);
	const sideBySide = spec.template === 'pannello' && hasPanel;
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
	if (sideBySide) {
		drawPanel(ctx, p, panel, m + textW + gap, top, textW, contentH - 6);
	} else {
		const panelTop = Math.max(blockTop + blockH + 40, top);
		drawPanel(ctx, p, panel, m, panelTop, W - m * 2 - 6, bottom - panelTop - 6);
	}
}
