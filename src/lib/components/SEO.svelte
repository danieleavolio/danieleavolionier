<script lang="ts">
	import { page } from '$app/stores';
	import type { FaqItem } from '$lib/types';

	export let title = '';
	export let description = '';
	export let image = '';
	export let isArticle = false;
	export let author = '';
	export let articleBody = '';
	export let isReview = false;
	export let gameName = '';
	export let gameImage = '';
	export let ratingValue = 0;
	export let reviewBody = '';
	export let developer = '';
	export let publishDate = '';
	export let updateDate = '';
	export let dateModified = '';
	export let noindex = false;
	export let faqItems: FaqItem[] = [];

	const siteName = 'Daniele Avolio';
	const siteBaseUrl = 'https://www.danieleavolio.it';
	const fallbackImage = 'https://i.imgur.com/juSgfgF.png';

	// Normalizzazione rigorosa del percorso e del Canonical URL (rimuove parametri query e trailing slashes)
	$: rawPath = ($page.url.pathname || '/').replace(/\/+$/, '') || '/';
	$: canonicalUrl = `${siteBaseUrl}${rawPath === '/' ? '' : rawPath}`;

	// Titolo completo e univoco con branding
	$: fullTitle = !title
		? 'Daniele Avolio - Data Engineer @ AgileLab'
		: title.includes('Daniele Avolio')
			? title
			: `${title} | Daniele Avolio`;

	$: safeDescription = (isReview ? reviewBody : description || '').trim();
	$: seoImageInput = (isReview ? gameImage : image) || fallbackImage;
	$: seoImage = seoImageInput.startsWith('http')
		? seoImageInput
		: new URL(seoImageInput, siteBaseUrl).href;
	$: robotsContent = noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';

	// Schema.org Breadcrumbs per la navigazione avanzata nei risultati di ricerca Google
	$: breadcrumbSchema = (() => {
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
	})();

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

	$: isHomepage = rawPath === '/';

	$: primarySchema = isArticle
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
					reviewBody: safeDescription
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
					};

	$: faqSchema = faqItems.length
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqItems.map((item) => ({
					'@type': 'Question',
					name: item.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: item.answer
					}
				}))
			}
		: null;

	$: schemaGraph = [
		primarySchema,
		...(breadcrumbSchema ? [breadcrumbSchema] : []),
		...(faqSchema ? [faqSchema] : [])
	];

	$: finalSchema = {
		'@context': 'https://schema.org',
		'@graph': schemaGraph
	};
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

	<script type="application/ld+json">
		{JSON.stringify(finalSchema)}
	</script>
</svelte:head>
