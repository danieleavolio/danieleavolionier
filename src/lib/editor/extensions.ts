import { Node, mergeAttributes } from '@tiptap/core';

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
			max: { default: 10 }
		};
	},
	parseHTML() {
		return [
			{
				tag: 'div[data-rich-block="gallery"]',
				getAttrs: (element) => ({
					kind: 'gallery',
					images: (element.getAttribute('data-images') ?? '').split('|').filter(Boolean)
				})
			},
			{
				tag: 'div[data-rich-block="grading"]',
				getAttrs: (element) => ({
					kind: 'grading',
					grade: Number(element.getAttribute('data-grade') ?? 0),
					max: Number(element.getAttribute('data-max') ?? 10),
					title: element.getAttribute('data-title') ?? ''
				})
			},
			{
				tag: 'iframe[src]',
				getAttrs: (element) => ({
					kind: 'embed',
					src: element.getAttribute('src') ?? '',
					title: element.getAttribute('title') ?? ''
				})
			},
			{
				tag: 'video[src]',
				getAttrs: (element) => ({
					kind: 'video',
					src: element.getAttribute('src') ?? '',
					title: element.getAttribute('title') ?? ''
				})
			}
		];
	},
	renderHTML({ HTMLAttributes }) {
		const { kind, src, title, images, grade, max, ...rest } = HTMLAttributes;

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
			return [
				'div',
				mergeAttributes(rest, {
					'data-rich-block': 'grading',
					'data-grade': grade,
					'data-max': max,
					...(title ? { 'data-title': title } : {}),
					class: 'rich-grading'
				}),
				`${title ? `${title} — ` : ''}Valutazione: ${grade}/${max}`
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
