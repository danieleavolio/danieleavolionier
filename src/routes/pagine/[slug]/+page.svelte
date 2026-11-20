<script lang="ts">
	import Author from '#lib/components/Author.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import * as config from '#lib/config.ts';
	import { formatDate, calculateReadingTime } from '#lib/utils.ts';
	import Tag from '#lib/components/Tag.svelte';
	import ShareComponent from '#lib/components/ShareComponent.svelte';
	import RichContent from '#lib/components/RichContent.svelte';
	import RelatedPosts from '#lib/components/RelatedPosts.svelte';
	import { page } from '$app/state';
	import { useI18n } from '#lib/i18n.ts';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const siteUrl = config.url.replace(/\/$/, '');
	const { locale } = useI18n();
	let translated = $state<{ title: string; description: string; contentHtml: string } | null>(null);
	let loadingTranslation = false;

	$effect(() => {
		if ($locale !== 'en' || translated || loadingTranslation) return;
		loadingTranslation = true;
		void (async () => {
			try {
				const [plain, rich] = await Promise.all([
					fetch('/api/translate', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ texts: [data.meta.title, data.meta.description] })
					}),
					fetch('/api/translate', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ texts: [data.contentHtml], html: true })
					})
				]);
				const plainData = (await plain.json()) as { translations: string[] };
				const richData = (await rich.json()) as { translations: string[] };
				translated = {
					title: plainData.translations[0] ?? data.meta.title,
					description: plainData.translations[1] ?? data.meta.description,
					contentHtml: richData.translations[0] ?? data.contentHtml
				};
			} catch {
				translated = null;
			} finally {
				loadingTranslation = false;
			}
		})();
	});

	let displayContent = $derived(translated?.contentHtml ?? data.contentHtml);
	let metadata = $derived(
		translated
			? { ...data.meta, title: translated.title, description: translated.description }
			: data.meta
	);
	let metadataCategories = $derived(Array.isArray(metadata.categories) ? metadata.categories : []);
	let fallbackOg = $derived(`${siteUrl}/og/pagine/${data.slug}.svg`);
	let seoImage = $derived(metadata.image || fallbackOg);
</script>

{#if metadata.isReview}
	<Seo
		title={metadata.title}
		description={metadata.description}
		image={seoImage}
		isReview={true}
		gameName={metadata.gameName}
		gameImage={seoImage}
		ratingValue={metadata.ratingValue}
		reviewBody={metadata.reviewBody}
		developer={metadata.developer}
		author="Daniele Avolio"
		publishDate={metadata.date}
	/>
{:else}
	<Seo
		title={metadata.title}
		description={metadata.description}
		image={seoImage}
		isArticle={true}
		author="Daniele Avolio"
		articleBody={metadata.description}
		publishDate={metadata.date}
		dateModified={metadata.updatedAt || metadata.date}
	/>
{/if}
<article>
	<hgroup class="review-banner">
		<h1>{data.meta.title}</h1>
		<h3>{data.meta.description}</h3>
		<p>
			Data: {formatDate(data.meta.date)} · {calculateReadingTime(
				displayContent || metadata.description
			)} min di lettura
		</p>
		{#if metadata.gameImage}
			<img class="banner-image" src={seoImage} alt={metadata.title} />
		{/if}
	</hgroup>

	<div class="tags">
		{#each metadataCategories as category, index (index)}
			<Tag {category} from="pagine" />
		{/each}
	</div>

	{#if metadata.image && !metadata.isReview}
		<img class="cover-image" src={metadata.image} alt={metadata.title} />
	{/if}

	<RichContent html={displayContent} />

	<RelatedPosts posts={data.relatedPosts} />

	<ShareComponent postTitle={metadata.title} postUrl={page.url.href} />

	<Author
		name="Daniele"
		surname="Avolio"
		username="lovaion"
		description="Sviluppatore e amante del mondo dei videogiochi 🎮 e della cultura pop giapponese 🗾"
	/>
</article>

<style>
	article {
		max-inline-size: 160cqh;
		margin-inline: auto;
	}

	h1 {
		text-transform: capitalize;
		font-weight: 600;
	}

	h3 {
		text-transform: none;
	}

	.tags {
		display: flex;
		gap: var(--size-3);
		margin-top: clamp(2.5rem, 6vw, 4rem);
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	hgroup {
		margin-bottom: var(--size-7);
		text-align: center;
		position: relative;
	}
	.review-banner {
		position: relative;
		padding: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		overflow: hidden;
	}

	.banner-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -1;
		opacity: 0.2;
		filter: blur(3px);
		border-radius: 10px;
		box-shadow: none;
		border: 2px solid var(--automataBlackO);
	}

	.review-banner::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	.review-banner h1,
	.review-banner h3,
	.review-banner p {
		position: relative;
		z-index: 1;
	}

	.cover-image {
		display: block;
		width: 100%;
		height: auto;
		margin: clamp(2rem, 5vw, 3.5rem) auto var(--size-7);
		border-radius: 10px;
		border: 2px solid var(--automataBlackO);
		object-fit: cover;
	}
</style>
