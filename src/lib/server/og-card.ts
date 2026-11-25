import satori from 'satori';
import sharp from 'sharp';
import manropeUrl from './og-fonts/manrope-latin-700-normal.woff?inline';
import serifUrl from './og-fonts/pt-serif-latin-700-normal.woff?inline';
import monoUrl from './og-fonts/jetbrains-mono-latin-700-normal.woff?inline';

const toBuffer = (dataUrl: string) => Buffer.from(dataUrl.split(',')[1], 'base64');

const fonts = [
	{ name: 'Manrope', data: toBuffer(manropeUrl), weight: 700 as const, style: 'normal' as const },
	{ name: 'PT Serif', data: toBuffer(serifUrl), weight: 700 as const, style: 'normal' as const },
	{
		name: 'JetBrains Mono',
		data: toBuffer(monoUrl),
		weight: 700 as const,
		style: 'normal' as const
	}
];

const INK = '#3d3b34';
const SOFT = '#5f5a4a';
const PAPER = '#c8c2aa';
const ACCENT = '#cd664d';

export interface OgCardInput {
	/** Etichetta in alto a destra, es. "BLOG". */
	label: string;
	title: string;
	description?: string;
	/** Riga in basso a destra: categorie o data. */
	footer?: string;
}

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
	type,
	props: { style: { display: 'flex', ...style }, ...(children === undefined ? {} : { children }) }
});

function clip(value: string, max: number) {
	const text = value.replace(/\s+/g, ' ').trim();
	return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function renderOgPng(input: OgCardInput): Promise<Buffer> {
	const title = clip(input.title, 120);
	const description = input.description ? clip(input.description, 170) : '';
	const titleSize = title.length > 80 ? 54 : title.length > 48 ? 64 : 76;

	const diamond = (size: number, inset: number, opacity: number) =>
		el('div', {
			position: 'absolute',
			right: inset,
			top: 315 - size / 2 - 20,
			width: size,
			height: size,
			border: `3px solid ${INK}`,
			opacity,
			transform: 'rotate(45deg)'
		});

	const tree = el(
		'div',
		{
			width: 1200,
			height: 630,
			position: 'relative',
			background: PAPER,
			backgroundImage:
				'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), linear-gradient(0deg, rgba(61,59,52,0.07) 1px, transparent 1px)',
			backgroundSize: '100% 100%, 100% 6px',
			fontFamily: 'Manrope'
		},
		[
			// decorazione a losanghi
			diamond(420, -120, 0.1),
			diamond(300, -60, 0.14),
			// cornice
			el('div', {
				position: 'absolute',
				left: 28,
				top: 28,
				right: 28,
				bottom: 28,
				border: `3px solid ${INK}`
			}),
			el('div', {
				position: 'absolute',
				left: 40,
				top: 40,
				right: 40,
				bottom: 40,
				border: `1px solid ${INK}`,
				opacity: 0.45
			}),
			// tacche d'angolo
			...[
				{ left: 22, top: 22 },
				{ right: 22, top: 22 },
				{ left: 22, bottom: 22 },
				{ right: 22, bottom: 22 }
			].map((pos) =>
				el('div', { position: 'absolute', width: 16, height: 16, background: ACCENT, ...pos })
			),
			// contenuto
			el(
				'div',
				{
					position: 'absolute',
					left: 84,
					right: 84,
					top: 76,
					bottom: 72,
					flexDirection: 'column',
					justifyContent: 'space-between'
				},
				[
					el(
						'div',
						{
							justifyContent: 'space-between',
							alignItems: 'center',
							fontFamily: 'JetBrains Mono',
							fontSize: 24,
							color: SOFT,
							letterSpacing: 3
						},
						[
							el('div', { alignItems: 'center' }, [
								el('div', {
									width: 16,
									height: 16,
									background: ACCENT,
									transform: 'rotate(45deg)',
									marginRight: 20
								}),
								el('div', {}, 'DANIELE AVOLIO // DATA ENGINEER')
							]),
							el(
								'div',
								{ border: `2px solid ${INK}`, color: INK, padding: '4px 16px' },
								`[ ${input.label.toUpperCase()} ]`
							)
						]
					),
					el('div', { flexDirection: 'column' }, [
						el('div', { alignItems: 'stretch' }, [
							el('div', { width: 12, background: ACCENT, marginRight: 36 }),
							el(
								'div',
								{
									fontFamily: 'PT Serif',
									fontSize: titleSize,
									lineHeight: 1.1,
									color: INK,
									lineClamp: 3,
									flex: 1
								},
								title
							)
						]),
						...(description
							? [
									el(
										'div',
										{
											marginTop: 28,
											marginLeft: 48,
											fontSize: 28,
											lineHeight: 1.35,
											color: SOFT,
											lineClamp: 2
										},
										description
									)
								]
							: [])
					]),
					el(
						'div',
						{
							justifyContent: 'space-between',
							alignItems: 'center',
							fontFamily: 'JetBrains Mono',
							fontSize: 24,
							color: INK,
							letterSpacing: 2,
							borderTop: `2px solid ${INK}`,
							paddingTop: 20
						},
						[
							el('div', {}, 'danieleavolio.it'),
							el('div', { color: SOFT }, clip(input.footer ?? '', 60))
						]
					)
				]
			)
		]
	);

	const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
	return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
