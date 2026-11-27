import { loadArticle } from '#lib/server/article-page.ts';

export const config = { isr: { expiration: 300 } };

export const load = ({ params, locals }) => loadArticle(locals.supabase, params.slug, 'it');
