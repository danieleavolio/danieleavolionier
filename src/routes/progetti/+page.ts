import type { Element } from '$lib/types';

export async function load({ fetch }) {
	const response = await fetch('api/progetti');
	const progetti: Element[] = await response.json();

	return { progetti };
}
