import FlexSearch from 'flexsearch';
import type { Element } from '$lib/types';

let postsIndex: FlexSearch.Index;
let posts: Element[];

export function createIndex(data: { posts: Element[]; progetti: Element[] }) {
	postsIndex = new FlexSearch.Index({ tokenize: 'forward' });

	const merged = data.posts.concat(data.progetti);
	merged.forEach((post, i) => {
		const item = `${post.title} ${post.description}`;
		postsIndex.add(i, item);
	});

	posts = merged;
}

export function searchPostsIndex(searchTerm: string) {
	if (!searchTerm.trim()) return [];

	const match = escapeRegex(searchTerm);
	const results = postsIndex.search(match);

	return results
		.map((index) => posts[index as number])
		.map(({ slug, title, description }) => {
			return {
				slug,
				title: replaceTextWithMarker(title, match),
				content: getMatches(description, match, 3)
			};
		});
}

function getMatches(text: string, searchTerm: string, limit = 1) {
	const regex = new RegExp(searchTerm, 'gi');
	const indexes: number[] = [];
	let matches = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null && matches < limit) {
		indexes.push(match.index);
		matches++;
	}

	return indexes.map((index) => {
		const start = Math.max(0, index - 20);
		const end = index + 80;
		const excerpt = text.substring(start, end).trim();
		return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
	});
}

function replaceTextWithMarker(text: string, match: string) {
	const safeText = escapeHtml(text);
	const regex = new RegExp(match, 'gi');
	return safeText.replaceAll(regex, (m) => `<mark>${m}</mark>`);
}

function escapeRegex(text: string) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text: string) {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}
