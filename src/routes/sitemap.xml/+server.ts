import fs from 'fs';
import path from 'path';

export async function GET() {
    const navHeaderLinks = ["/", "/pagine", "/progetti", "/data", "/appunti"];
    const blogLinks = getBlogLinks();
    const projectLinks = getProjectLinks();
    const notesLinks = getNotesLinks();
    const linkItems = [...navHeaderLinks, ...blogLinks, ...projectLinks, ...notesLinks];
    const sitemap = generateSitemap(linkItems);
    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}

function getBlogLinks() {
    const blogPostsDirectory = path.join(process.cwd(), "src/posts");
    const fileNames = fs.readdirSync(blogPostsDirectory);
    const blogLinks = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        return `/pagine/${slug}`;
    }
    );
    return blogLinks;
}

function getProjectLinks() {
    const projectDirectory = path.join(process.cwd(), "src/progetti");
    const fileNames = fs.readdirSync(projectDirectory);
    const projectLinks = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        return `/progetti/${slug}`;
    }
    );
    return projectLinks;
}

function getNotesLinks() {
    const notesDirectory = path.join(process.cwd(), "/static/files");
    const fileNames = fs.readdirSync(notesDirectory);
    
    // note that the url is somethign like this
    // https://www.danieleavolio.it/files/q&a.pdf
    const notesLinks = fileNames.map((fileName) => {
        return `/files/${fileName}`;
    });
    return notesLinks;
}

function generateSitemap(linkItems: any[]) {
    const siteURL = "https://www.danieleavolio.it";
    const sitemapEntries = linkItems.map(
        (link: any) => `<url><loc>${siteURL}${link}</loc></url>`.trim()
    ).join("");
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries}
    </urlset>`

    sitemap.replace(/\n/g, "");
    return sitemap;
}
