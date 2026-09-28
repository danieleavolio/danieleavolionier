import FlexSearch from 'flexsearch';
import type { Element } from '$lib/types';
import { notes } from '$lib/notes_files_desc';

export interface SearchEntry {
	slug: string;
	title: string;
	description: string;
	type: 'post' | 'progetto' | 'appunto';
	isExternal?: boolean;
}

export interface SearchResult {
	slug: string;
	title: string;
	content: string[];
	type: 'post' | 'progetto' | 'appunto';
	isExternal?: boolean;
}

let searchIndex: FlexSearch.Index;
let allEntries: SearchEntry[] = [];

export function createIndex(data: { posts: Element[]; progetti: Element[] }) {
	searchIndex = new FlexSearch.Index({ tokenize: 'forward' });

	const postEntries: SearchEntry[] = (data.posts || []).map((p) => ({
		slug: p.slug.startsWith('pagine/') ? p.slug : `pagine/${p.slug}`,
		title: p.title,
		description: p.description || '',
		type: 'post'
	}));

	const projectEntries: SearchEntry[] = (data.progetti || []).map((pr) => ({
		slug: pr.slug.startsWith('progetti/') ? pr.slug : `progetti/${pr.slug}`,
		title: pr.title,
		description: pr.description || '',
		type: 'progetto'
	}));

	const noteEntries: SearchEntry[] = (notes || []).map((n) => ({
		slug: n.downloadLink,
		title: n.title,
		description: n.description || '',
		type: 'appunto',
		isExternal: n.downloadLink.startsWith('http')
	}));

	allEntries = [...postEntries, ...projectEntries, ...noteEntries];

	allEntries.forEach((entry, i) => {
		const item = `${entry.title} ${entry.description}`;
		searchIndex.add(i, item);
	});
}

export function searchPostsIndex(searchTerm: string): SearchResult[] {
	if (!searchIndex || !searchTerm.trim()) return [];

	const match = escapeRegex(searchTerm);
	const results = searchIndex.search(match);

	return results
		.map((index) => allEntries[index as number])
		.filter(Boolean)
		.map((entry) => {
			return {
				slug: entry.slug,
				title: replaceTextWithMarker(entry.title, match),
				content: getMatches(entry.description, match, 2),
				type: entry.type,
				isExternal: entry.isExternal
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
