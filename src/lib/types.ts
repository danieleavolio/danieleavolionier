export type FaqItem = {
	question: string;
	answer: string;
};

export type Element = {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories: string[];
	published: boolean;
	image?: string;
	contentHtml?: string;
	contentJson?: RichTextDocument | null;
	legacyContent?: string | null;
	metadata?: Record<string, unknown>;
	hasImage?: boolean;
	isReview?: boolean;
	gameName?: string;
	gameImage?: string;
	ratingValue?: number;
	reviewBody?: string;
	developer?: string;
};

export type RichTextMark = {
	type: string;
	attrs?: Record<string, unknown>;
};

export type RichTextNode = {
	type: string;
	attrs?: Record<string, unknown>;
	content?: RichTextNode[];
	marks?: RichTextMark[];
	text?: string;
};

export type RichTextDocument = {
	type: 'doc';
	content?: RichTextNode[];
};

export type NowItem = {
	id: string;
	title: string;
	description: string;
	category: string;
	status: 'active' | 'completed' | 'paused';
	link?: string | null;
	position: number;
	published: boolean;
	updated_at?: string;
};

export interface stackElement {
	slug: string;
	title: string;
	color: string;
}
