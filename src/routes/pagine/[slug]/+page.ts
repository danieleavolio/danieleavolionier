import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await import(`../../../posts/${params.slug}.md`);
		return {
			slug: params.slug,
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		throw error(404, 'Pagina non trovata');
	}
}
