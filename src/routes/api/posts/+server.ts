import { json } from '@sveltejs/kit';
import { listPublishedContent } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET() {
	return json(await listPublishedContent(supabaseAdmin, 'posts'));
}
