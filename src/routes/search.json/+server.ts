import { json } from '@sveltejs/kit';
import type { Element } from '$lib/types';

export const prerender = true;

export async function GET({ fetch }) {
	const postsResponse = await fetch('/api/posts');
	const posts: Element[] = await postsResponse.json();

	for (const post of posts) {
		post.slug = `pagine/${post.slug}`;
	}

	const projectsResponse = await fetch('/api/progetti');
	const progetti: Element[] = await projectsResponse.json();

	for (const project of progetti) {
		project.slug = `progetti/${project.slug}`;
	}

	return json({ posts, progetti });
}
