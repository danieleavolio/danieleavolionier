import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export async function GET() {
	const filePath = resolve('static/files/files.json');
	const raw = readFileSync(filePath, 'utf8');
	const allFiles = JSON.parse(raw);

	return new Response(JSON.stringify(allFiles), {
		headers: { 'Content-Type': 'application/json' }
	});
}
