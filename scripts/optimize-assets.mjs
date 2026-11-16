import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

// Reproducible, build-time-only optimization. Original artwork is kept untouched.
for (const width of [320, 640]) {
	const info = await sharp('static/images/avatar.png')
		.resize({ width, withoutEnlargement: true })
		.webp({ quality: width === 320 ? 94 : 90, effort: 6 })
		.toFile(`static/images/avatar-${width}.webp`);
	console.log(`avatar-${width}.webp: ${info.width}x${info.height}, ${info.size} bytes`);
}

for (const [source, destination] of [
	['https://i.imgur.com/FMYB47Q.png', 'static/images/nier-divider.png'],
	['https://i.imgur.com/h8f3hwW.png', 'static/images/nier-link.png']
]) {
	const response = await fetch(source);
	if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
		throw new Error(`Could not download original artwork: ${source}`);
	}
	await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

// Keep exactly the Material Symbols glyphs used by the site, not the full variable font.
await mkdir('static/fonts', { recursive: true });
const fontCssURL =
	'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=arrow_back,arrow_forward,download,search,warning&display=block';
const cssResponse = await fetch(fontCssURL, {
	headers: { 'User-Agent': 'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36' }
});
if (!cssResponse.ok) throw new Error('Could not get the Material Symbols subset');
const css = await cssResponse.text();
const fontURL = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
if (!fontURL) throw new Error('Material Symbols CSS did not contain a font');
const fontResponse = await fetch(fontURL);
if (!fontResponse.ok) throw new Error('Could not download the Material Symbols subset');
const font = Buffer.from(await fontResponse.arrayBuffer());
await writeFile('static/fonts/material-symbols-subset.woff2', font);
console.log(`Material Symbols subset: ${font.length} bytes`);
const licenseResponse = await fetch(
	'https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE'
);
if (!licenseResponse.ok) throw new Error('Could not download the Material Symbols license');
await writeFile('static/fonts/Material-Symbols-LICENSE.txt', await licenseResponse.text());
