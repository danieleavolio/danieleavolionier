import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const prerender = false;

const POSTS_DIR = path.resolve('src/posts');
const STACK_ELEMENTS_DIR = path.resolve('src/stackElements');
const STACK_ELEMENTS_JSON = path.resolve('src/lib/stackElements.json');
const ADMIN_PASSWORD = 'password'; // Change this to a secure password

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const password = data.get('password');
		const title = data.get('title');
		const description = data.get('description');
		const categories = data.get('categories');
		const content = data.get('content');

		if (password !== ADMIN_PASSWORD) {
			return fail(401, { message: 'Password non valida' });
		}

		if (!title || !description || !categories || !content) {
			return fail(400, { message: 'Tutti i campi sono obbligatori' });
		}

		const slug = title
			.toString()
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');

		const today = new Date();
		const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

		const categoriesArray = categories.toString().split(',').map((c: string) => c.trim());

		const fileContent = `---
title: "${title}"
description: "${description}"
date: "${date}"
categories: [${categoriesArray.map((c: string) => `"${c}"`).join(', ')}]
published: true
---

${content}`;

		try {
			fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), fileContent);
			return { message: 'Post salvato con successo!' };
		} catch (error) {
			return fail(500, { message: 'Errore durante il salvataggio del post' });
		}
	},
	createStackElement: async ({ request }) => {
		const data = await request.formData();
		const password = data.get('password');
		const title = data.get('stackTitle');
		const color = data.get('stackColor');

		if (password !== ADMIN_PASSWORD) {
			return fail(401, { message: 'Password non valida' });
		}

		if (!title || !color) {
			return fail(400, { message: 'Tutti i campi sono obbligatori' });
		}

		const slug = title
			.toString()
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');

		const newStackElement = {
			slug,
			title,
			color
		};

		try {
			const stackElements = JSON.parse(fs.readFileSync(STACK_ELEMENTS_JSON, 'utf-8'));
			stackElements.push(newStackElement);
			fs.writeFileSync(STACK_ELEMENTS_JSON, JSON.stringify(stackElements, null, 2));
			fs.writeFileSync(path.join(STACK_ELEMENTS_DIR, `${slug}.md`), `# ${title}`);
			return { message: 'Elemento stack salvato con successo!' };
		} catch (error) {
			return fail(500, { message: 'Errore durante il salvataggio dell\'elemento stack' });
		}
	}
};

