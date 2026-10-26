import { Node, mergeAttributes } from '@tiptap/core';
import { gradingRange, parseArrayLiteral } from '$lib/rich-grading';

function nodeToElement(node: any): HTMLElement {
	if (node?.element instanceof HTMLElement) return node.element as HTMLElement;
	return node as HTMLElement;
}

function readDataArray(element: HTMLElement, attribute: string): string[] {
	const element_ = element;
	return parseArrayLiteral(element_.getAttribute?.(attribute));
}

export const RichBlock = Node.create({
	name: 'richBlock',
	group: 'block',
	atom: true,
	addAttributes() {
		return {
			kind: { default: 'embed' },
			src: { default: '' },
			title: { default: '' },
			images: { default: [] },
			grade: { default: 0 },
			max: { default: 10 },
			pros: { default: [] },
			cons: { default: [] }
		};
	},
	parseHTML() {
		return [
			{
				tag: 'div[data-rich-block="gallery"]',
				getAttrs: (element) => ({
					kind: 'gallery',
					images: (nodeToElement(element).getAttribute('data-images') ?? '')
						.split('|')
						.filter(Boolean)
				})
			},
			{
				tag: 'div[data-rich-block="grading"]',
				getAttrs: (element) => ({
					kind: 'grading',
					grade: Number(nodeToElement(element).getAttribute('data-grade') ?? 0),
					max: Number(nodeToElement(element).getAttribute('data-max') ?? 10),
					title: nodeToElement(element).getAttribute('data-title') ?? '',
					pros: readDataArray(nodeToElement(element), 'data-pros'),
					cons: readDataArray(nodeToElement(element), 'data-cons')
				})
			},
			{
				tag: 'iframe[src]',
				getAttrs: (element) => ({
					kind: 'embed',
					src: nodeToElement(element).getAttribute('src') ?? '',
					title: nodeToElement(element).getAttribute('title') ?? ''
				})
			},
			{
				tag: 'video[src]',
				getAttrs: (element) => ({
					kind: 'video',
					src: nodeToElement(element).getAttribute('src') ?? '',
					title: nodeToElement(element).getAttribute('title') ?? ''
				})
			}
		];
	},
	renderHTML({ HTMLAttributes }) {
		const { kind, src, title, images, grade, max, pros, cons, ...rest } = HTMLAttributes;

		if (kind === 'gallery') {
			const galleryImages = Array.isArray(images) ? images : [];
			return [
				'div',
				mergeAttributes(rest, { 'data-rich-block': 'gallery', class: 'rich-gallery' }),
				...galleryImages.map((image: string) => [
					'img',
					{ src: image, alt: title || 'Immagine della galleria', loading: 'lazy' }
				])
			];
		}

		if (kind === 'grading') {
			const info = {
				grade: Number(grade) || 0,
				max: Number(max) || 10,
				title: title ?? '',
				pros: Array.isArray(pros) ? pros.map(String) : [],
				cons: Array.isArray(cons) ? cons.map(String) : []
			};
			const listSpec = (items: string[]) => ['ul', {}, ...items.map((item) => ['li', {}, item])];

			return [
				'div',
				mergeAttributes(rest, {
					'data-rich-block': 'grading',
					'data-grade': `${info.grade}`,
					'data-max': `${info.max}`,
					class: `rich-grading rg-${gradingRange(info.grade, info.max)}`,
					...(info.title ? { 'data-title': info.title } : {}),
					'data-pros': JSON.stringify(info.pros),
					'data-cons': JSON.stringify(info.cons)
				}),
				['div', { class: 'rg-grade' }, ['span', `${info.grade}`]],
				['div', { class: 'rg-list rg-pros' }, ['h3', {}, 'Pros'], listSpec(info.pros)],
				['div', { class: 'rg-list rg-cons' }, ['h3', {}, 'Cons'], listSpec(info.cons)],
				...(info.title ? [['h2', { class: 'rg-title' }, info.title]] : [])
			];
		}

		if (kind === 'video') {
			return [
				'video',
				mergeAttributes(rest, { src, controls: true, title: title || 'Video', preload: 'metadata' })
			];
		}

		return [
			'iframe',
			mergeAttributes(rest, {
				src,
				title: title || 'Contenuto incorporato',
				loading: 'lazy',
				allowfullscreen: 'true'
			})
		];
	}
});

export function createRichExtensions() {
	return [RichBlock];
}
