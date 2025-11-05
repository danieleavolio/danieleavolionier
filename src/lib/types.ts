
export type Element = {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories: string[];
	published: boolean;
	image?: string;
	hasImage?: boolean;
	isReview?: boolean;
	gameName?: string;
	gameImage?: string;
	ratingValue?: number;
	reviewBody?: string;
	developer?: string;
};

export interface stackElement {
    slug: string;
    title: string;
    color: string;
}
