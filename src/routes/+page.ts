import type { Element } from '$lib/types';

export async function load({ fetch }) {
	const postsResponse = await fetch('/api/posts');
	const projectsResponse = await fetch('/api/progetti');

	const posts: Element[] = await postsResponse.json();
	const progetti: Element[] = await projectsResponse.json();

	return { posts, progetti };
}
