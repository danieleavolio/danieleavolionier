import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { parseChart } from '#lib/bar-chart.ts';
import { gradingRange, parseArrayLiteral } from '#lib/rich-grading.ts';
import { isGalleryUrl, isGalleryVideo } from '#lib/rich-gallery.ts';

function nodeToElement(node: unknown): HTMLElement {
	if (node instanceof HTMLElement) return node;
	if (node && typeof node === 'object' && 'element' in node && node.element instanceof HTMLElement)
		return node.element;
	throw new TypeError('Expected an HTML element for a rich content block');
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
				getAttrs: (element) => {
					const gallery = nodeToElement(element);
					const images = (gallery.getAttribute('data-images') ?? '')
						.split('|')
						.filter(isGalleryUrl);
					return {
						kind: 'gallery',
						images: images.length
							? images
							: [...gallery.querySelectorAll('img[src], video[src]')]
									.map((item) => item.getAttribute('src') ?? '')
									.filter(isGalleryUrl)
					};
				}
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
			const galleryImages = Array.isArray(images) ? (images as string[]).filter(isGalleryUrl) : [];
			return [
				'div',
				mergeAttributes(rest, {
					'data-rich-block': 'gallery',
					'data-images': galleryImages.join('|'),
					class: 'rich-gallery'
				}),
				...galleryImages.map((image, i) =>
					isGalleryVideo(image)
						? ['video', { src: image, controls: true, preload: 'none' }]
						: [
								'img',
								{ src: image, alt: title || `Immagine ${i + 1} della galleria`, loading: 'lazy' }
							]
				)
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
				[
					'div',
					{ class: 'rg-grade' },
					['span', `${info.grade}`],
					['span', { class: 'rg-max' }, `/${info.max}`]
				],
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

export function chartEditButtons(open: (position: number) => void) {
	return Extension.create({
		name: 'chartEditButtons',
		addProseMirrorPlugins() {
			return [
				new Plugin({
					props: {
						decorations(state) {
							const buttons: Decoration[] = [];
							state.doc.descendants((node, position) => {
								if (node.type.name !== 'codeBlock') return;
								if (node.attrs.language !== 'bar-chart' || !parseChart(node.textContent))
									return false;
								buttons.push(
									Decoration.widget(
										position,
										(_view, getPosition) => {
											const button = document.createElement('button');
											button.type = 'button';
											button.className = 'chart-edit-button';
											button.textContent = 'Modifica grafico';
											button.setAttribute('aria-haspopup', 'dialog');
											button.addEventListener('click', () => {
												const at = getPosition();
												if (at !== undefined) open(at);
											});
											return button;
										},
										{ side: -1, key: `chart-edit-${position}` }
									)
								);
								return false;
							});
							return DecorationSet.create(state.doc, buttons);
						}
					}
				})
			];
		}
	});
}
