import { convertGradingTags, escapeHtmlText } from '#lib/rich-grading.ts';
import { repairPlainMarkdownHtml } from './markdown-repair';

// Exact legacy URLs, not a rewrite of the article or a dependency on its old Markdown.
const repairedMedia = new Map<string, string | null>([
	['https://imgur.com/a/3I6SYtt', 'https://i.imgur.com/j47Rjyr.png'],
	['https://thumbs.gfycat.com/ArcticEasyAfricanpiedkingfisher-size_restricted.gif', null],
	[
		'https://i.kinja-img.com/image/upload/c_fit,q_60,w_1600/f5b2634f1b81eb003954ae9c34afba8c.jpg',
		'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1931770/ss_0461966d2cf288b631165c5e1e00399483bb52c7.1920x1080.jpg'
	],
	['https://www.gameuidatabase.com/uploads/video/Nier-Automata08062024-110330-5395.mp4', null]
]);

function repairMedia(source: string): string {
	return source
		.replace(/(<div\b[^>]*\bdata-images=)(["'])(.*?)\2/gi, (block, prefix, quote, images) => {
			const urls = images.split('|') as string[];
			if (!urls.some((url) => repairedMedia.has(url))) return block;
			const next = urls.flatMap((url) =>
				repairedMedia.has(url) ? (repairedMedia.get(url) ?? []) : url
			);
			return `${prefix}${quote}${next.join('|')}${quote}`;
		})
		.replace(/(?:<p>\s*(<img\b[^>]*>)\s*<\/p>)|(<img\b[^>]*>)/gi, (block, wrapped, standalone) => {
			const tag = wrapped ?? standalone;
			const match = tag.match(/\ssrc=(["'])(.*?)\1/i) as RegExpMatchArray | null;
			if (!match || !repairedMedia.has(match[2])) return block;
			const next = repairedMedia.get(match[2]);
			return next ? block.replace(match[0], ` src="${escapeHtmlText(next)}"`) : '';
		});
}

export function restoreArticleHtml(
	html: string | null | undefined,
	metadata: Record<string, unknown>
): string {
	return repairMedia(convertGradingTags(repairPlainMarkdownHtml(html), metadata));
}
