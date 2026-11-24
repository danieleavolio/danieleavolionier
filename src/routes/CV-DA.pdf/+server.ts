import { read } from '$app/server';
import cv from '#lib/assets/CV-DA.pdf';

// Served from a route instead of static/ so the PDF can point Google to the HTML CV page.
export function GET() {
	const response = read(cv);
	return new Response(response.body, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="CV-DA.pdf"',
			Link: '<https://www.danieleavolio.it/cv>; rel="canonical"',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
}
