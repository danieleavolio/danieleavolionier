import { json } from '@sveltejs/kit';

import type { Element } from '$lib/types';

async function getPosts() {
	let posts: Element[] = [];

	const paths = import.meta.glob('/src/posts/*.md', {
		eager: true
	});

	for (const path in paths) {
		const file: any = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Element, 'slug'>;
			const element: Element = {
				...metadata,
				slug,
				categories: Array.isArray(metadata.categories) ? metadata.categories : []
			};
			element.published && posts.push(element);
		}
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return posts;
}

export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
