import type { RichTextDocument } from '$lib/types';

export type ContentRow = {
	slug: string;
	title?: string;
	description?: string;
	date: string;
	created_at?: string;
	updated_at?: string;
	categories?: string[];
	image?: string;
	published?: boolean;
	content?: string;
	content_html?: string;
	content_json?: RichTextDocument;
	legacy_content?: string;
	metadata?: Record<string, unknown> & {
		isReview?: boolean;
		gameName?: string;
		gameImage?: string;
		ratingValue?: number;
		reviewBody?: string;
		developer?: string;
	};
};
