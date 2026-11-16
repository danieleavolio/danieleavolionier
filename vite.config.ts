import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte, type MdsvexOptions } from 'mdsvex';
import shiki from 'shiki';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import { resolve } from 'node:path';

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: [
				vitePreprocess(),
				mdsvex({
					extensions: ['.md'],
					layout: { _: resolve('src/mdsvex.svelte') },
					highlight: {
						highlighter: async (code, lang = 'text') => {
							const highlighter = await shiki.getHighlighter({ theme: 'one-dark-pro' });
							const html = escapeSvelte(highlighter.codeToHtml(code, { lang: lang || 'text' }));
							return `{@html \`${html}\`}`;
						}
					},
					// mdsvex's older unified types predate these compatible typed AST plugins.
					remarkPlugins: [
						remarkUnwrapImages,
						[remarkToc, { tight: true }]
					] as MdsvexOptions['remarkPlugins'],
					rehypePlugins: [rehypeSlug] as MdsvexOptions['rehypePlugins']
				})
			],
			adapter: process.env.BUILD_PREVIEW === 'true' ? undefined : adapter({ runtime: 'nodejs22.x' })
		})
	]
});
