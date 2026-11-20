<script lang="ts">
	import { page } from '$app/state';
	import { serializeJsonLd } from '#lib/seo.ts';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		isArticle?: boolean;
		author?: string;
		articleBody?: string;
		isReview?: boolean;
		gameName?: string;
		gameImage?: string;
		ratingValue?: number;
		reviewBody?: string;
		developer?: string;
		publishDate?: string;
		updateDate?: string;
		dateModified?: string;
		noindex?: boolean;
		faq?: Array<{ question: string; answer: string }>;
	}

	let {
		title = '',
		description = '',
		image = '',
		isArticle = false,
		author = '',
		articleBody = '',
		isReview = false,
		gameName = '',
		gameImage = '',
		ratingValue = 0,
		reviewBody = '',
		developer = '',
		publishDate = '',
		updateDate = '',
		dateModified = '',
		noindex = false,
		faq = []
	}: Props = $props();

	const siteName = 'Daniele Avolio';
	const siteBaseUrl = 'https://www.danieleavolio.it';
	const fallbackImage = `${siteBaseUrl}/images/avatar-640.webp`;

	// Normalizzazione rigorosa del percorso e del Canonical URL (rimuove parametri query e trailing slashes)
	let rawPath = $derived((page.url.pathname || '/').replace(/\/+$/, '') || '/');
	let canonicalUrl = $derived(`${siteBaseUrl}${rawPath === '/' ? '' : rawPath}`);

	// Titolo completo e univoco con branding
	let fullTitle = $derived(
		!title || title === 'Daniele Avolio'
			? 'Daniele Avolio - Data Engineer @ AgileLab'
			: title.includes('Daniele Avolio')
				? title
				: `${title} | Daniele Avolio`
	);

	let safeDescription = $derived(
		((isReview ? reviewBody || description : description) || '').trim()
	);
	let seoImageInput = $derived((isReview ? gameImage : image) || fallbackImage);
	let seoImage = $derived(
		seoImageInput.startsWith('http') ? seoImageInput : new URL(seoImageInput, siteBaseUrl).href
	);
	let robotsContent = $derived(
		noindex
			? 'noindex,nofollow'
			: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
	);

	// Schema.org Breadcrumbs per la navigazione avanzata nei risultati di ricerca Google
	let breadcrumbSchema = $derived(
		(() => {
			const segments = rawPath.split('/').filter(Boolean);
			if (segments.length === 0) return null;

			const itemListElement = [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: siteBaseUrl
				}
			];

			let accumulated = siteBaseUrl;
			segments.forEach((seg, idx) => {
				accumulated += `/${seg}`;
				const formattedName =
					seg === 'pagine'
						? 'Blog'
						: seg === 'progetti'
							? 'Progetti'
							: seg === 'appunti'
								? 'Appunti'
								: seg === 'now'
									? 'Now'
									: seg === 'data'
										? 'Data'
										: seg === 'end-of-the-lova'
											? 'End of the Lova'
											: seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

				itemListElement.push({
					'@type': 'ListItem',
					position: idx + 2,
					name: formattedName,
					item: accumulated
				});
			});

			return {
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement
			};
		})()
	);

	// Schema Person per Daniele Avolio
	const personSchema = {
		'@type': 'Person',
		'@id': `${siteBaseUrl}/#person`,
		name: 'Daniele Avolio',
		jobTitle: 'Data Engineer',
		worksFor: {
			'@type': 'Organization',
			name: 'AgileLab',
			url: 'https://agilelab.it/'
		},
		url: siteBaseUrl,
		image: fallbackImage,
		sameAs: [
			'https://github.com/danieleavolio',
			'https://www.linkedin.com/in/danieleavolio/',
			'https://twitter.com/avolio_daniele'
		],
		alumniOf: {
			'@type': 'EducationalOrganization',
			name: 'Università della Calabria (Unical)'
		}
	};

	let isHomepage = $derived(rawPath === '/');

	let primarySchema = $derived(
		isArticle
			? {
					'@context': 'https://schema.org',
					'@type': 'Article',
					mainEntityOfPage: {
						'@type': 'WebPage',
						'@id': canonicalUrl
					},
					headline: fullTitle,
					image: [seoImage],
					author: {
						'@type': 'Person',
						name: author || siteName,
						url: siteBaseUrl
					},
					publisher: {
						'@type': 'Organization',
						name: siteName,
						logo: {
							'@type': 'ImageObject',
							url: fallbackImage
						}
					},
					description: safeDescription,
					articleBody: articleBody || safeDescription,
					...(publishDate ? { datePublished: publishDate } : {}),
					...(dateModified || updateDate || publishDate
						? { dateModified: dateModified || updateDate || publishDate }
						: {})
				}
			: isReview
				? {
						'@context': 'https://schema.org',
						'@type': 'Review',
						image: seoImage,
						itemReviewed: {
							'@type': 'VideoGame',
							name: gameName || title,
							image: seoImage,
							author: developer ? { '@type': 'Organization', name: developer } : undefined
						},
						author: {
							'@type': 'Person',
							name: author || siteName,
							url: siteBaseUrl
						},
						reviewRating: {
							'@type': 'Rating',
							ratingValue,
							bestRating: 10,
							worstRating: 0
						},
						publisher: {
							'@type': 'Organization',
							name: siteName
						},
						reviewBody: safeDescription,
						...(publishDate ? { datePublished: publishDate } : {})
					}
				: isHomepage
					? {
							'@context': 'https://schema.org',
							'@type': 'WebSite',
							'@id': `${siteBaseUrl}/#website`,
							name: siteName,
							url: siteBaseUrl,
							description: safeDescription,
							publisher: personSchema
						}
					: {
							'@context': 'https://schema.org',
							'@type': 'WebPage',
							name: fullTitle,
							description: safeDescription,
							url: canonicalUrl,
							image: seoImage,
							author: personSchema
						}
	);

	let faqSchema = $derived(
		faq.length
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faq.map((item) => ({
						'@type': 'Question',
						name: item.question,
						acceptedAnswer: { '@type': 'Answer', text: item.answer }
					}))
				}
			: null
	);

	let schemaGraph = $derived([
		primarySchema,
		...(breadcrumbSchema ? [breadcrumbSchema] : []),
		...(faqSchema ? [faqSchema] : [])
	]);
	// FAQ data is not emitted: these answers are not displayed on the page.
	let finalSchema = $derived({ '@context': 'https://schema.org', '@graph': schemaGraph });

	let jsonLdMarkup = $derived(
		`<script type="application/ld+json">${serializeJsonLd(finalSchema)}` + '</scr' + 'ipt>'
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={safeDescription} />
	<meta name="robots" content={robotsContent} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="it_IT" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={safeDescription} />
	<meta property="og:type" content={isArticle || isReview ? 'article' : 'website'} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={seoImage} />
	<meta property="og:image:alt" content={fullTitle} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={safeDescription} />
	<meta name="twitter:image" content={seoImage} />
	<meta name="twitter:image:alt" content={fullTitle} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serializeJsonLd escapes HTML script terminators; covered by unit tests. -->
	{@html jsonLdMarkup}
</svelte:head>
