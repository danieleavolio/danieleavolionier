import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await import(`../../../progetti/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		throw error(404, 'Pagina non trovata');
	}
}
