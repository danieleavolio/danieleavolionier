import type { CoverSpec } from '#lib/editor/cover-render.ts';

/**
 * Covers made with the studio carry their settings in a PNG `tEXt` chunk, so the
 * image can be reopened and edited later. Uploaded images have no chunk and stay
 * plain images.
 */
const KEYWORD = 'yorha-cover';
const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

let crcTable: Uint32Array | undefined;
function crc32(bytes: Uint8Array): number {
	crcTable ??= Uint32Array.from({ length: 256 }, (_, n) => {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		return c >>> 0;
	});
	let crc = 0xffffffff;
	for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

const latin1 = (text: string) => Uint8Array.from(text, (char) => char.charCodeAt(0));

function toBase64(text: string): string {
	return btoa(String.fromCharCode(...new TextEncoder().encode(text)));
}

function fromBase64(text: string): string {
	return new TextDecoder().decode(Uint8Array.from(atob(text), (char) => char.charCodeAt(0)));
}

const isPng = (bytes: Uint8Array) => SIGNATURE.every((value, i) => bytes[i] === value);

/** Returns the PNG with the spec stored right after the header chunk. */
export async function embedCoverSpec(blob: Blob, spec: CoverSpec): Promise<Blob> {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	if (!isPng(bytes)) return blob;

	const data = latin1(`${KEYWORD}\0${toBase64(JSON.stringify(spec))}`);
	const type = latin1('tEXt');
	const chunk = new Uint8Array(12 + data.length);
	const view = new DataView(chunk.buffer);
	view.setUint32(0, data.length);
	chunk.set(type, 4);
	chunk.set(data, 8);
	view.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));

	// The 13-byte IHDR chunk ends at offset 33.
	const insertAt = 33;
	const out = new Uint8Array(bytes.length + chunk.length);
	out.set(bytes.subarray(0, insertAt));
	out.set(chunk, insertAt);
	out.set(bytes.subarray(insertAt), insertAt + chunk.length);
	return new Blob([out], { type: 'image/png' });
}

/** Reads the studio settings from a PNG, or null when it was not made by the studio. */
export function readCoverSpec(buffer: ArrayBuffer): CoverSpec | null {
	const bytes = new Uint8Array(buffer);
	if (!isPng(bytes)) return null;
	const view = new DataView(buffer);
	let offset = 8;
	while (offset + 12 <= bytes.length) {
		const length = view.getUint32(offset);
		const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
		if (type === 'IDAT') return null;
		if (type === 'tEXt') {
			const text = String.fromCharCode(...bytes.subarray(offset + 8, offset + 8 + length));
			const [keyword, value] = text.split('\0');
			if (keyword === KEYWORD && value) {
				try {
					const spec = JSON.parse(fromBase64(value)) as CoverSpec;
					return spec && typeof spec === 'object' && 'template' in spec ? spec : null;
				} catch {
					return null;
				}
			}
		}
		offset += 12 + length;
	}
	return null;
}
