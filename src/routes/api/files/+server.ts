import { json } from '@sveltejs/kit';
import allFiles from '../../../../static/files/files.json';

export async function GET() {
	return json(allFiles);
}
