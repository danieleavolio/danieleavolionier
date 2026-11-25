import type { EditableContent } from '#lib/server/admin-content.ts';

// Unsaved editor state lives only in this browser, one entry per content type and slug.
// It is never written to Supabase automatically.

const PREFIX = 'da-draft:';

export type DraftFields = Pick<
	EditableContent,
	| 'title'
	| 'slug'
	| 'description'
	| 'date'
	| 'categories'
	| 'image'
	| 'published'
	| 'contentHtml'
	| 'contentJson'
	| 'metadata'
>;

export type StoredDraft = { savedAt: number; fields: DraftFields };

export function draftKey(contentType: unknown, originalSlug: string): string {
	return `${PREFIX}${String(contentType || 'contenuto')}:${originalSlug || 'nuovo'}`;
}

export function draftFields(item: EditableContent): DraftFields {
	return {
		title: item.title,
		slug: item.slug,
		description: item.description,
		date: item.date,
		categories: [...item.categories],
		image: item.image,
		published: item.published,
		contentHtml: item.contentHtml,
		contentJson: item.contentJson,
		metadata: { ...item.metadata }
	};
}

export function serializeFields(fields: DraftFields): string {
	return JSON.stringify(fields);
}

function storage(): Storage | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

export function saveDraft(key: string, fields: DraftFields): void {
	try {
		storage()?.setItem(key, JSON.stringify({ savedAt: Date.now(), fields } satisfies StoredDraft));
	} catch {
		// Quota exceeded or storage disabled: autosave is best effort.
	}
}

export function loadDraft(key: string): StoredDraft | null {
	try {
		const raw = storage()?.getItem(key);
		if (!raw) return null;
		const draft = JSON.parse(raw) as StoredDraft;
		return draft && typeof draft.savedAt === 'number' && draft.fields ? draft : null;
	} catch {
		return null;
	}
}

export function clearDraft(key: string): void {
	try {
		storage()?.removeItem(key);
	} catch {
		// Nothing to clear.
	}
}
