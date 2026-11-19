export async function load({ url, data }) {
	return {
		url: url.pathname,
		locale: data.locale
	};
}
