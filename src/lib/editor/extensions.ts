import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { Table } from '@tiptap/extension-table';
import { Plugin } from '@tiptap/pm/state';
import { parseHighlight } from '#lib/table-highlight.ts';
import Suggestion from '@tiptap/suggestion';
import type { Editor, Range } from '@tiptap/core';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
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

/** Turns a YouTube or Vimeo page link into its embeddable player URL, or null for anything else. */
export function toEmbedUrl(raw: string): string | null {
	try {
		const url = new URL(raw.trim());
		const host = url.hostname.replace(/^www\./, '');
		let id: string | null = null;
		if (host === 'youtu.be') id = url.pathname.slice(1);
		else if (host === 'youtube.com' || host === 'm.youtube.com') {
			const path = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
			id = url.pathname === '/watch' ? url.searchParams.get('v') : (path?.[1] ?? null);
		} else if (host === 'vimeo.com') {
			const num = url.pathname.match(/^\/(\d+)/);
			return num ? `https://player.vimeo.com/video/${num[1]}` : null;
		}
		return id && /^[\w-]+$/.test(id) ? `https://www.youtube.com/embed/${id}` : null;
	} catch {
		return null;
	}
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
		const {
			kind: rawKind,
			src: rawSrc,
			title,
			images,
			grade,
			max,
			pros,
			cons,
			...rest
		} = HTMLAttributes;
		const embedSrc =
			rawKind === 'video' || rawKind === 'embed' ? toEmbedUrl(String(rawSrc ?? '')) : null;
		const kind = embedSrc ? 'embed' : rawKind;
		const src = embedSrc ?? rawSrc;

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

export const CALLOUT_TONES = ['info', 'warning', 'error', 'tip'] as const;
export type CalloutTone = (typeof CALLOUT_TONES)[number];

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		callout: {
			/** Wraps the selected blocks in a note box, or unwraps them when already inside one. */
			toggleCallout: (tone?: CalloutTone) => ReturnType;
		};
	}
}

/** A note box with a tone (info, warning, tip) that can hold any block content. */
export const Callout = Node.create({
	name: 'callout',
	group: 'block',
	content: 'block+',
	defining: true,
	addAttributes() {
		return { tone: { default: 'info' } };
	},
	parseHTML() {
		return [
			{
				tag: 'div[data-callout]',
				getAttrs: (element) => {
					const tone = nodeToElement(element).getAttribute('data-callout') ?? 'info';
					return { tone: CALLOUT_TONES.includes(tone as CalloutTone) ? tone : 'info' };
				}
			}
		];
	},
	renderHTML({ HTMLAttributes }) {
		const { tone, ...rest } = HTMLAttributes;
		return [
			'div',
			mergeAttributes(rest, { 'data-callout': tone, class: `rich-callout callout-${tone}` }),
			0
		];
	},
	addCommands() {
		return {
			toggleCallout:
				(tone = 'info') =>
				({ commands, editor }) =>
					editor.isActive('callout')
						? commands.lift('callout')
						: commands.wrapIn('callout', { tone })
		};
	}
});

/** Tabella con l'attributo `data-hl` (evidenziazione per colonna, vedi `table-highlight.ts`). */
export const HighlightTable = Table.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			highlight: {
				default: null,
				parseHTML: (element) => parseHighlight(element.getAttribute('data-hl'))?.join(',') ?? null,
				renderHTML: ({ highlight }) => (highlight ? { 'data-hl': highlight } : {})
			}
		};
	}
});

export function createRichExtensions() {
	return [RichBlock, Callout];
}

export type SlashItem = {
	title: string;
	hint: string;
	keywords: string;
	run: (editor: Editor, range: Range) => void;
};

/**
 * A "/" menu that lists block types while typing. The items are supplied by
 * the editor component because some of them open the studios.
 */
export function slashMenu(getItems: () => SlashItem[]) {
	return Extension.create({
		name: 'slashMenu',
		addProseMirrorPlugins() {
			return [
				Suggestion<SlashItem, SlashItem>({
					editor: this.editor,
					char: '/',
					allow: ({ state, range }) => !state.doc.resolve(range.from).parent.type.spec.code,
					items: ({ query }) => {
						const needle = query.trim().toLowerCase();
						return getItems().filter(
							(item) => !needle || `${item.title} ${item.keywords}`.toLowerCase().includes(needle)
						);
					},
					command: ({ editor, range, props }) => props.run(editor, range),
					render: () => {
						let menu: HTMLDivElement | null = null;
						let selected = 0;
						let current: { items: SlashItem[]; command: (item: SlashItem) => void } | null = null;

						const paint = () => {
							if (!menu || !current) return;
							menu.replaceChildren(
								...current.items.map((item, index) => {
									const option = document.createElement('button');
									option.type = 'button';
									option.className = 'slash-option';
									option.setAttribute('role', 'option');
									option.setAttribute('aria-selected', String(index === selected));
									const title = document.createElement('strong');
									title.textContent = item.title;
									const hint = document.createElement('span');
									hint.textContent = item.hint;
									option.append(title, hint);
									option.addEventListener('mousedown', (event) => {
										event.preventDefault();
										current?.command(item);
									});
									return option;
								})
							);
						};

						const place = (rect: (() => DOMRect | null) | null | undefined) => {
							const box = rect?.();
							if (!menu || !box) return;
							menu.style.left = `${Math.max(8, Math.min(box.left, window.innerWidth - 280))}px`;
							menu.style.top = `${box.bottom + 6}px`;
						};

						const update = (props: {
							items: SlashItem[];
							command: (item: SlashItem) => void;
							clientRect?: (() => DOMRect | null) | null;
						}) => {
							current = props;
							selected = Math.min(selected, Math.max(0, props.items.length - 1));
							if (!menu) return;
							menu.hidden = props.items.length === 0;
							paint();
							place(props.clientRect);
						};

						return {
							onStart: (props) => {
								menu = document.createElement('div');
								menu.className = 'slash-menu';
								menu.setAttribute('role', 'listbox');
								menu.setAttribute('aria-label', 'Blocchi disponibili');
								document.body.append(menu);
								selected = 0;
								update(props);
							},
							onUpdate: (props) => update(props),
							onKeyDown: ({ event }) => {
								if (!current || current.items.length === 0) return false;
								const count = current.items.length;
								if (event.key === 'ArrowDown') selected = (selected + 1) % count;
								else if (event.key === 'ArrowUp') selected = (selected - 1 + count) % count;
								else if (event.key === 'Enter') current.command(current.items[selected]);
								else return false;
								paint();
								return true;
							},
							onExit: () => {
								menu?.remove();
								menu = null;
								current = null;
							}
						};
					}
				})
			];
		}
	});
}

export type CodeBlockEditButton = {
	language: string;
	label: string;
	accepts: (source: string) => boolean;
	open: (position: number) => void;
};

/** An edit button above each code block that one of the studios can reopen. */
export function codeBlockEditButtons(kinds: CodeBlockEditButton[]) {
	return Extension.create({
		name: 'codeBlockEditButtons',
		addProseMirrorPlugins() {
			return [
				new Plugin({
					props: {
						decorations(state) {
							const buttons: Decoration[] = [];
							state.doc.descendants((node, position) => {
								if (node.type.name !== 'codeBlock') return;
								const kind = kinds.find(({ language }) => language === node.attrs.language);
								if (!kind || !kind.accepts(node.textContent)) return false;
								buttons.push(
									Decoration.widget(
										position,
										(_view, getPosition) => {
											const button = document.createElement('button');
											button.type = 'button';
											button.className = 'block-edit-button';
											button.textContent = kind.label;
											button.setAttribute('aria-haspopup', 'dialog');
											button.addEventListener('click', () => {
												const at = getPosition();
												if (at !== undefined) kind.open(at);
											});
											return button;
										},
										{ side: -1, key: `${kind.language}-edit-${position}` }
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

const CODE_LANGUAGES: [value: string, label: string][] = [
	['', 'Automatico'],
	['bash', 'Bash'],
	['powershell', 'PowerShell'],
	['json', 'JSON'],
	['javascript', 'JavaScript / TypeScript'],
	['python', 'Python'],
	['css', 'CSS'],
	['html', 'HTML / Svelte'],
	['yaml', 'YAML'],
	['diff', 'Diff'],
	['markdown', 'Markdown'],
	['mermaid', 'Mermaid'],
	['bar-chart', 'Grafico a barre'],
	['text', 'Testo semplice']
];

/** A language selector above each code block: sets the fence language by hand. */
export const CodeBlockLanguagePicker = Extension.create({
	name: 'codeBlockLanguagePicker',
	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					decorations(state) {
						const pickers: Decoration[] = [];
						state.doc.descendants((node, position) => {
							if (node.type.name !== 'codeBlock') return;
							const current = String(node.attrs.language ?? '');
							pickers.push(
								Decoration.widget(
									position,
									(view, getPosition) => {
										const select = document.createElement('select');
										select.className = 'block-language-select';
										select.setAttribute('aria-label', 'Linguaggio del blocco di codice');
										const options = CODE_LANGUAGES.some(([value]) => value === current)
											? CODE_LANGUAGES
											: [...CODE_LANGUAGES, [current, current] as [string, string]];
										for (const [value, label] of options) {
											const option = document.createElement('option');
											option.value = value;
											option.textContent = `Linguaggio: ${label}`;
											option.selected = value === current;
											select.append(option);
										}
										select.addEventListener('change', () => {
											const at = getPosition();
											if (at === undefined) return;
											const target = view.state.doc.nodeAt(at);
											if (target?.type.name !== 'codeBlock') return;
											view.dispatch(
												view.state.tr.setNodeMarkup(at, undefined, {
													...target.attrs,
													language: select.value || null
												})
											);
											view.focus();
										});
										return select;
									},
									{ side: -2, key: `code-language-${position}-${current}`, ignoreSelection: true }
								)
							);
							return false;
						});
						return DecorationSet.create(state.doc, pickers);
					}
				}
			})
		];
	}
});
