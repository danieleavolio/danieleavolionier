import type { Element, RelatedPost } from '#lib/types.ts';

type PostSummary = Pick<Element, 'slug' | 'title' | 'description' | 'categories' | 'published'>;
type Vector = Map<string, number>;

// Initial editorial tuning, not calibrated probabilities. No reader tracking.
const MIN_SCORE = 0.14;
const MAX_RESULTS = 3;
const WEIGHTS = { categories: 0.45, text: 0.3, themes: 0.25 };
const STOPWORDS = new Set(
	'a ad al alla alle allo ai agli anche che chi ci coi col come con da dal dalla dalle dei del della delle dello di e ed era essere fa fra gli ha hai ho i il in io la le lo loro ma me mi mio nel nella nelle nello non o per poi proprio quale questo questa qui se si sia solo sono su sul sulla tra tu un una uno vi wow'.split(
		' '
	)
);
const CATEGORY_ALIASES: Readonly<Record<string, string>> = {
	svelte: 'sveltekit',
	coding: 'programmazione'
};
const CATEGORY_LABELS: Readonly<Record<string, string>> = { sveltekit: 'SvelteKit' };
const GENERIC_CATEGORIES = new Set(['pc', 'ps4', 'xbox one', 'nintendo switch', 'blog']);

// Explicit topic vocabulary: bridges different labels without pretending to use embeddings.
const THEMES = [
	{
		key: 'ai-coding',
		label: 'sviluppo assistito da AI',
		weight: 2.5,
		match: /\b(opencode|codex|coding)\b/
	},
	{
		key: 'web',
		label: 'sviluppo web',
		weight: 1.2,
		match: /\b(svelte|sveltekit|frontend|web|filtri|ui)\b/
	},
	{
		key: 'ai',
		label: 'intelligenza artificiale',
		weight: 0.8,
		match: /\b(ai|llm|codex|opencode|machine.learning|scikit)\b/
	},
	{
		key: 'games',
		label: 'videogiochi',
		weight: 1.5,
		match: /\b(videogiochi|recensione|recensioni)\b/
	},
	{
		key: 'puzzle',
		label: 'enigmi e deduzione',
		weight: 1.2,
		match: /\b(puzzle|enigmi|deduzione)\b/
	},
	{
		key: 'university',
		label: 'università e vita personale',
		weight: 1.5,
		match: /\b(universita|unical|erasmus)\b/
	},
	{
		key: 'phones',
		label: 'riparazione smartphone',
		weight: 1.5,
		match: /\b(pixel|telefoni|riparazione)\b/
	}
];

function normalize(value: string): string {
	return value
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim();
}

function tokens(value: string): string[] {
	return (normalize(value).match(/[\p{L}\p{N}]+/gu) ?? []).filter(
		(word) => word.length > 2 && !STOPWORDS.has(word)
	);
}

function categories(post: PostSummary): Set<string> {
	return new Set(
		post.categories
			.map((category) => normalize(category))
			.filter(Boolean)
			.map((category) => CATEGORY_ALIASES[category] ?? category)
	);
}

function themes(post: PostSummary): Set<string> {
	const text = normalize([post.title, post.description, ...post.categories].join(' '));
	return new Set(THEMES.filter((theme) => theme.match.test(text)).map((theme) => theme.key));
}

function weightedJaccard(
	left: Set<string>,
	right: Set<string>,
	weight: (key: string) => number
): number {
	let sharedWeight = 0;
	let totalWeight = 0;
	for (const key of new Set([...left, ...right])) {
		const value = weight(key);
		totalWeight += value;
		if (left.has(key) && right.has(key)) sharedWeight += value;
	}
	return totalWeight ? sharedWeight / totalWeight : 0;
}

function termFrequency(post: PostSummary): Vector {
	const counts: Vector = new Map();
	// Repeating title tokens gives them more weight without requiring full article bodies.
	for (const word of [...tokens(post.title), ...tokens(post.title), ...tokens(post.description)]) {
		counts.set(word, (counts.get(word) ?? 0) + 1);
	}
	return counts;
}

function textVectors(posts: PostSummary[]): Vector[] {
	const documents = posts.map(termFrequency);
	const frequencies: Vector = new Map();
	for (const document of documents) {
		for (const term of document.keys()) {
			frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
		}
	}
	return documents.map(
		(document) =>
			new Map(
				[...document].map(([term, count]) => [
					term,
					(1 + Math.log(count)) *
						(Math.log((posts.length + 1) / ((frequencies.get(term) ?? 0) + 1)) + 1)
				])
			)
	);
}

function cosine(left: Vector, right: Vector): number {
	let dot = 0;
	let leftNorm = 0;
	let rightNorm = 0;
	for (const [term, value] of left) {
		leftNorm += value * value;
		dot += value * (right.get(term) ?? 0);
	}
	for (const value of right.values()) rightNorm += value * value;
	return leftNorm && rightNorm ? dot / Math.sqrt(leftNorm * rightNorm) : 0;
}

export function selectRelatedPosts(current: PostSummary, candidates: PostSummary[]): RelatedPost[] {
	// Defence in depth: never rank drafts, the current post or duplicate slugs.
	const unique = new Map(
		candidates
			.filter((post) => post.published === true && post.slug !== current.slug)
			.map((post) => [post.slug, post])
	);
	const corpus = [current, ...unique.values()];
	const categorySets = corpus.map(categories);
	const themeSets = corpus.map(themes);
	const vectors = textVectors(corpus);
	const categoryFrequency: Vector = new Map();
	for (const set of categorySets) {
		for (const tag of set) categoryFrequency.set(tag, (categoryFrequency.get(tag) ?? 0) + 1);
	}
	const categoryWeight = (tag: string) =>
		(Math.log((corpus.length + 1) / ((categoryFrequency.get(tag) ?? 0) + 1)) + 1) *
		(GENERIC_CATEGORIES.has(tag) ? 0.2 : 1);
	const themeWeight = (key: string) => THEMES.find((theme) => theme.key === key)?.weight ?? 0;

	return (
		corpus
			.slice(1)
			.map((post, index) => {
				const candidateIndex = index + 1;
				const textSimilarity = cosine(vectors[0], vectors[candidateIndex]);
				const score =
					WEIGHTS.categories *
						weightedJaccard(categorySets[0], categorySets[candidateIndex], categoryWeight) +
					WEIGHTS.text * textSimilarity +
					WEIGHTS.themes * weightedJaccard(themeSets[0], themeSets[candidateIndex], themeWeight);
				const sharedCategories = [...categorySets[0]]
					.filter((tag) => categorySets[candidateIndex].has(tag) && !GENERIC_CATEGORIES.has(tag))
					.sort((a, b) => categoryWeight(b) - categoryWeight(a) || a.localeCompare(b));
				const sharedTheme = THEMES.find(
					(theme) => themeSets[0].has(theme.key) && themeSets[candidateIndex].has(theme.key)
				);
				const reason = sharedCategories.length
					? `In comune: ${sharedCategories
							.slice(0, 2)
							.map((tag) => CATEGORY_LABELS[tag] ?? tag)
							.join(' · ')}`
					: sharedTheme
						? `Stesso tema: ${sharedTheme.label}`
						: 'Titolo e descrizione con argomenti vicini';
				// Shared platforms alone (e.g. PC/PS4) do not establish a topic relationship.
				const hasContentRelation =
					sharedCategories.length > 0 || sharedTheme !== undefined || textSimilarity >= 0.2;
				return { post, score: hasContentRelation ? score : 0, reason };
			})
			.filter(({ score }) => score >= MIN_SCORE)
			.sort((a, b) => b.score - a.score || a.post.slug.localeCompare(b.post.slug))
			.slice(0, MAX_RESULTS)
			// Keep ranking internals and unused CMS fields out of HTML/data payloads.
			.map(({ post, reason }) => ({
				slug: post.slug,
				title: post.title,
				description: post.description,
				reason
			}))
	);
}
