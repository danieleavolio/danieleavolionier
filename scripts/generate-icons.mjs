// Rigenera favicon e icone PWA da un unico disegno SVG. Uso: node scripts/generate-icons.mjs
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const INK = '#2e2c26';
const PAPER = '#d9d2b4';
const ACCENT = '#cd664d';

const letters = `
	<path d="M11 20H22L29 27V37L22 44H11Z" fill="none" stroke="${PAPER}" stroke-width="5.5" stroke-linejoin="miter"/>
	<path d="M36 45L45.5 19L55 45M39.5 37H51.5" fill="none" stroke="${PAPER}" stroke-width="5.5" stroke-linejoin="miter"/>`;

const brackets = (c) => `
	<path d="M6 15V6H15M49 6H58V15M58 49V58H49M15 58H6V49" fill="none" stroke="${c}" stroke-width="2.5"/>`;

const svg = (detail) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${INK}"/>${detail ? brackets(ACCENT) : ''}${letters}<rect x="${detail ? 29 : 28}" y="52" width="6" height="6" fill="${ACCENT}" transform="rotate(45 ${detail ? 32 : 31} 55)"/></svg>`;

const render = (size, detail) =>
	sharp(Buffer.from(svg(detail)), { density: 384 })
		.resize(size, size)
		.png({ compressionLevel: 9 })
		.toBuffer();

await writeFile('static/icon.svg', svg(true));
const out = {
	'static/favicon-16x16.png': await render(16, false),
	'static/favicon-32x32.png': await render(32, false),
	'static/favicon.png': await render(48, true),
	'static/apple-touch-icon.png': await render(180, true),
	'static/android-chrome-192x192.png': await render(192, true),
	'static/android-chrome-512x512.png': await render(512, true)
};
for (const [path, data] of Object.entries(out)) await writeFile(path, data);

// favicon.ico con PNG incorporati (16, 32, 48)
const frames = [
	[16, out['static/favicon-16x16.png']],
	[32, out['static/favicon-32x32.png']],
	[48, out['static/favicon.png']]
];
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach(([size, data], i) => {
	const at = 6 + i * 16;
	header.writeUInt8(size, at);
	header.writeUInt8(size, at + 1);
	header.writeUInt16LE(1, at + 4);
	header.writeUInt16LE(32, at + 6);
	header.writeUInt32LE(data.length, at + 8);
	header.writeUInt32LE(offset, at + 12);
	offset += data.length;
});
await writeFile('static/favicon.ico', Buffer.concat([header, ...frames.map(([, d]) => d)]));
console.log('Icone rigenerate.');
