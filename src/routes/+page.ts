import type { Element } from '$lib/types';

export async function load({ fetch }) {
	const response = await fetch('api/posts');
	const posts: Element[] = await response.json();

	return { posts };
}
