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
			`${opening}${items.replace(/<a\b[^>]*>[\s\S]*?<\/a>|<img\b[^>]*>/gi, (item) => {
				if (!/^<img\b/i.test(item)) return item;
				const src = item.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
				const url = src?.[1] ?? src?.[2] ?? '';
				if (!isGalleryUrl(url)) return item;
				return `<a href="${url.replace(/"/g, '&quot;')}">${item}</a>`;
			})}</div>`
	);
}
