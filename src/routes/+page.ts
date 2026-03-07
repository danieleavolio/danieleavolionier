import type { Element } from '$lib/types';

export async function load({ fetch }) {
	const postsResponse = await fetch('/api/posts');
	const projectsResponse = await fetch('/api/progetti');

	const posts: Element[] = postsResponse.ok ? await postsResponse.json() : [];
	const progetti: Element[] = projectsResponse.ok ? await projectsResponse.json() : [];

	return { posts, progetti };
}
