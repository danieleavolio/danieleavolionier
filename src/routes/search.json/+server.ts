import { json } from '@sveltejs/kit';
import { searchContent } from '$lib/server/content';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET() {
	const content = await searchContent(supabaseAdmin);
	const posts = content.filter((item) => item.slug && item.metadata?.contentType === 'posts');
	const progetti = content.filter((item) => item.slug && item.metadata?.contentType === 'projects');

	return json({
		posts: posts.map((post) => ({ ...post, slug: `pagine/${post.slug}` })),
		progetti: progetti.map((project) => ({ ...project, slug: `progetti/${project.slug}` }))
	});
}
