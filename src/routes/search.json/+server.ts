import { json } from '@sveltejs/kit';
import { searchContent } from '$lib/server/content';

export async function GET({ locals }) {
	const content = await searchContent(locals.supabase);
	const posts = content.filter((item) => item.slug && item.metadata?.contentType === 'posts');
	const progetti = content.filter((item) => item.slug && item.metadata?.contentType === 'projects');

	return json({
		posts: posts.map((post) => ({ ...post, slug: `pagine/${post.slug}` })),
		progetti: progetti.map((project) => ({ ...project, slug: `progetti/${project.slug}` }))
	});
}
