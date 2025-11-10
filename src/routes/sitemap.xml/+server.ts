export const prerender = true;

export async function GET() {
	const navHeaderLinks = ['/', '/pagine', '/progetti', '/data', '/appunti'];

	const blogPosts = import.meta.glob('/src/posts/*.md');
	const blogLinks = Object.keys(blogPosts).map((path) =>
		`/pagine/${path.split('/').pop()?.replace('.md', '')}`
	);

	const projectPosts = import.meta.glob('/src/progetti/*.md');
	const projectLinks = Object.keys(projectPosts).map((path) =>
		`/progetti/${path.split('/').pop()?.replace('.md', '')}`
	);

	const notesPosts = import.meta.glob('/static/files/*.*');
	const notesLinks = Object.keys(notesPosts).map((path) => `/files/${path.split('/').pop()}`);

	const linkItems = [...navHeaderLinks, ...blogLinks, ...projectLinks, ...notesLinks];
	const sitemap = generateSitemap(linkItems);
	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}

function generateSitemap(linkItems: string[]) {
	const siteURL = 'https://www.danieleavolio.it';
	const sitemapEntries = linkItems
		.map((link: any) => `<url><loc>${siteURL}${link}</loc></url>`.trim())
		.join('');
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries}
    </urlset>`;

	return sitemap.replace(/\n/g, '');
}
