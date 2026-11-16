// Use Vercel's framework-independent script rather than an SDK with Kit 2 peer dependencies.
export function injectAnalytics() {
	if (document.querySelector('script[src="/_vercel/insights/script.js"]')) return;
	const script = document.createElement('script');
	script.defer = true;
	script.src = '/_vercel/insights/script.js';
	document.head.appendChild(script);
}
