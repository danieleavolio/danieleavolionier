export function isGalleryVideo(src: string): boolean {
	return /\.(?:mp4|webm|ogv)(?:[?#]|$)/i.test(src);
}

export function isGalleryUrl(src: string): boolean {
	return /^(?:https?:\/\/|\/(?![/\\]))[^\s<>]+$/i.test(src);
}

export function linkGalleryImages(html: string): string {
	return html.replace(
		/(<div\b[^>]*\bdata-rich-block=(?:"gallery"|'gallery')[^>]*>)([\s\S]*?)<\/div>/gi,
		(_gallery, opening: string, items: string) =>
			`${opening}${items.replace(
				/<a\b[^>]*>[\s\S]*?<\/a>|<img\b[^>]*>|<video\b[^>]*>[\s\S]*?<\/video>/gi,
				(item) => {
					const isVideo = /^<video\b/i.test(item);
					if (!isVideo && !/^<img\b/i.test(item)) return item;
					const src = item.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
					const url = src?.[1] ?? src?.[2] ?? '';
					if (!isGalleryUrl(url)) return item;
					// A tile is only a preview: playback happens in the lightbox. Without
					// preload the tile stays an empty box, and its own controls would eat the click.
					const tile = isVideo
						? item
								.replace(
									/\s(?:controls|preload|muted|playsinline)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi,
									''
								)
								.replace(/^<video\b/i, '<video preload="metadata" muted playsinline')
						: item;
					return `<a href="${url.replace(/"/g, '&quot;')}"${isVideo ? ' class="gallery-video"' : ''}>${tile}</a>`;
				}
			)}</div>`
	);
}
