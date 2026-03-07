import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const POSTS_DIR = path.resolve('src/posts');
const ADMIN_PASSWORD = 'password'; // Change this to a secure password
const IS_READONLY_RUNTIME = !!process.env.VERCEL;

type FrontmatterData = Record<string, string>;

function parseFrontmatter(content: string): { frontmatter: FrontmatterData; body: string } {
	const match = content.match(/---\r?\n([\s\S]+?)\r?\n---/);
	if (match) {
		const frontmatter = match[1];
		const body = content.slice(match[0].length);
		const data: FrontmatterData = {};
		frontmatter.split('\n').forEach((line: string) => {
			const [key, ...value] = line.split(':');
			if (key && value) {
				data[key.trim()] = value.join(':').trim();
			}
		});
		return { frontmatter: data, body };
	}
	return { frontmatter: {}, body: content };
}

function isAuthorized(
	password: FormDataEntryValue | null,
	cookieValue: string | undefined
): boolean {
	return password === ADMIN_PASSWORD || cookieValue === ADMIN_PASSWORD;
}

function formatErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : 'Errore sconosciuto';
}

export async function load({ cookies }) {
	const posts = fs.readdirSync(POSTS_DIR).map((file) => {
		const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
		const { frontmatter, body } = parseFrontmatter(content);
		return {
			slug: file.replace(/\.md$/, ''),
			title: frontmatter.title,
			description: frontmatter.description,
			categories: frontmatter.categories
				? frontmatter.categories
						.replace(/[[\]]/g, '')
						.split(',')
						.map((c: string) => c.trim().replace(/["']/g, ''))
				: [],
			content: body.trim()
		};
	});

	return {
		posts,
		authenticated: cookies.get('admin_auth') === ADMIN_PASSWORD
	};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const password = data.get('password');
		const title = data.get('title');
		const description = data.get('description');
		const categories = data.get('categories');
		const content = data.get('content');
		const slug = data.get('slug');

		if (!isAuthorized(password, cookies.get('admin_auth'))) {
			return fail(401, { message: 'Password non valida' });
		}

		if (IS_READONLY_RUNTIME) {
			return fail(403, {
				message: 'Operazione non disponibile in produzione: filesystem in sola lettura.'
			});
		}

		cookies.set('admin_auth', ADMIN_PASSWORD, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax',
			httpOnly: false
		});

		if (!title || !description || !categories || !content) {
			return fail(400, { message: 'Tutti i campi sono obbligatori' });
		}

		const newSlug =
			slug ||
			title
				.toString()
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/\s+/g, '-');

		const today = new Date();
		const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

		const categoriesArray = categories
			.toString()
			.split(',')
			.map((c: string) => c.trim());

		const fileContent = `---
title: "${title}"
description: "${description}"
date: "${date}"
categories: [${categoriesArray.map((c: string) => `"${c}"`).join(', ')}]
published: true
---

${content}`;

		try {
			fs.writeFileSync(path.join(POSTS_DIR, `${newSlug}.md`), fileContent);
			return { message: 'Post salvato con successo!' };
		} catch (error) {
			return fail(500, {
				message: `Errore durante il salvataggio del post: ${formatErrorMessage(error)}`
			});
		}
	},
	remove: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password');
		const slug = data.get('slug')?.toString();

		if (!isAuthorized(password, cookies.get('admin_auth'))) {
			return fail(401, { message: 'Password non valida' });
		}

		if (IS_READONLY_RUNTIME) {
			return fail(403, {
				message: 'Operazione non disponibile in produzione: filesystem in sola lettura.'
			});
		}

		if (!slug) {
			return fail(400, { message: 'Slug mancante' });
		}

		const filePath = path.join(POSTS_DIR, `${slug}.md`);
		if (!fs.existsSync(filePath)) {
			return fail(404, { message: 'Post non trovato' });
		}

		try {
			fs.unlinkSync(filePath);
			return { message: 'Post eliminato con successo!' };
		} catch (error) {
			return fail(500, {
				message: `Errore durante l'eliminazione del post: ${formatErrorMessage(error)}`
			});
		}
	}
};
