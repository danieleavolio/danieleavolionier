<script lang="ts">
	import { formatDate } from '#lib/utils.ts';
	import Author from '#lib/components/Author.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import * as config from '#lib/config.ts';
	import Tag from '#lib/components/Tag.svelte';
	import RichContent from '#lib/components/RichContent.svelte';
	import { useI18n } from '#lib/i18n.ts';
	import type { PageData } from './$types';

	export let data: PageData;

	const siteUrl = config.url.replace(/\/$/, '');
	const { locale } = useI18n();
	let translated: { title: string; description: string; contentHtml: string } | null = null;
	let loadingTranslation = false;

	$: if ($locale === 'en' && !translated && !loadingTranslation) {
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
	}

	$: metadata = translated
		? { ...data.meta, title: translated.title, description: translated.description }
		: data.meta;
	$: displayContent = translated?.contentHtml ?? data.contentHtml;
	$: metadataCategories = Array.isArray(metadata.categories) ? metadata.categories : [];
	$: fallbackOg = `${siteUrl}/og/progetti/${data.slug}.svg`;
	$: seoImage = metadata.image || fallbackOg;
</script>

<Seo
	title={metadata.title}
	description={metadata.description}
	image={seoImage}
	isArticle={true}
	author="Daniele Avolio"
	publishDate={metadata.date}
	dateModified={metadata.updatedAt || metadata.date}
	articleBody={metadata.description}
/>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<h3>{data.meta.description}</h3>
		<p>Data: {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each metadataCategories as category, index (index)}
			<Tag {category} from="progetti" />
		{/each}
	</div>

	{#if metadata.image}
		<img class="cover-image" src={metadata.image} alt={metadata.title} />
	{/if}

	<RichContent html={displayContent} />

	<Author
		name="Daniele"
		surname="Avolio"
		username="lovaion"
		description="Sviluppatore e amante del mondo dei videogiochi 🎮 e della cultura pop giapponese 🗾"
	/>
</article>

<style>
	.cover-image {
		display: block;
		width: 100%;
		height: auto;
		margin: clamp(2rem, 5vw, 3.5rem) auto var(--size-7);
		border-radius: 10px;
		border: 2px solid var(--automataBlackO);
		object-fit: cover;
	}

	article {
		max-inline-size: 120ch;
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
	}
</style>
