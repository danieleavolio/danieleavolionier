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
	export let noindex = false;
	export let faqItems: FaqItem[] = [];

	const siteName = 'Daniele Avolio';
	const fallbackImage = 'https://i.imgur.com/juSgfgF.png';

	$: currentUrl = $page.url.href;
	$: safeDescription = (isReview ? reviewBody : description || '').trim();
	$: canonicalUrl = currentUrl.split('#')[0];
	$: seoImageInput = (isReview ? gameImage : image) || fallbackImage;
	$: seoImage = seoImageInput.startsWith('http')
		? seoImageInput
		: new URL(seoImageInput, canonicalUrl).href;
	$: robotsContent = noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';

	$: primarySchema = isArticle
		? {
				'@context': 'https://schema.org',
				'@type': 'Article',
				mainEntityOfPage: {
					'@type': 'WebPage',
					'@id': canonicalUrl
				},
				headline: title,
				image: [seoImage],
				author: {
					'@type': 'Person',
					name: author || siteName
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
				...(publishDate ? { datePublished: publishDate } : {})
			}
		: isReview
			? {
					'@context': 'https://schema.org',
					'@type': 'Review',
					image: seoImage,
					itemReviewed: {
						'@type': 'VideoGame',
						name: gameName,
						image: seoImage,
						author: developer
					},
					author: {
						'@type': 'Person',
						name: author || siteName,
						url: 'https://www.danieleavolio.it'
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
			: {
					'@context': 'https://schema.org',
					'@type': 'WebPage',
					name: title,
					description: safeDescription,
					url: canonicalUrl,
					image: seoImage
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

	$: schema = faqSchema
		? {
				'@context': 'https://schema.org',
				'@graph': [primarySchema, faqSchema]
			}
		: primarySchema;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={safeDescription} />
	<meta name="robots" content={robotsContent} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="it_IT" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={safeDescription} />
	<meta property="og:type" content={isArticle || isReview ? 'article' : 'website'} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={seoImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={safeDescription} />
	<meta name="twitter:image" content={seoImage} />

	<script type="application/ld+json">
		{JSON.stringify(schema)}
	</script>
</svelte:head>
