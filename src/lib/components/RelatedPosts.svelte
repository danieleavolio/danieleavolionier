<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { RelatedPost } from '#lib/types.ts';

	let { posts }: { posts: RelatedPost[] } = $props();
</script>

{#if posts.length}
	<section class="related-posts" aria-labelledby="related-posts-heading">
		<div class="section-heading">
			<h2 id="related-posts-heading">
				<span class="heading-square" aria-hidden="true"></span>Leggi anche
			</h2>
		</div>
		<p class="intro">Altre letture sullo stesso tema.</p>
		<ul class="related-list">
			{#each posts as post, index (post.slug)}
				<li>
					<a class="related-card" href={`/pagine/${encodeURIComponent(post.slug)}`}>
						<span class="card-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
						<h3>{post.title}</h3>
						<p class="description">{post.description}</p>
						<p class="reason">{post.reason}</p>
						<span class="read-link">Leggi articolo<Icon name="arrow-right" size={18} /></span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.related-posts {
		min-width: 0;
		margin-block: var(--size-8);
		padding-block: var(--size-5);
		border-top: 1px solid var(--automataBlackOpacity);
		border-bottom: 1px solid var(--automataBlackOpacity);
	}

	.section-heading {
		background-color: var(--automataBgRGBA);
		padding: 0.2em 0.5em;
	}

	h2 {
		display: flex;
		align-items: center;
		gap: 0.3em;
	}

	h2 :global(svg) {
		flex-shrink: 0;
	}

	.heading-square {
		flex: 0 0 auto;
		width: 0.6rem;
		height: 0.6rem;
		background: currentColor;
	}

	.intro {
		margin-block: var(--size-3) var(--size-5);
		color: var(--text-2);
	}

	.related-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
		gap: var(--size-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		min-width: 0;
		max-inline-size: none;
		margin: 0;
		padding: 0;
		background-image: none;
	}

	.related-card {
		display: flex;
		flex-direction: column;
		gap: var(--size-3);
		min-width: 0;
		width: 100%;
		padding: var(--size-5);
		box-sizing: border-box;
		background-color: var(--automataBgOpacity);
		border: 1px solid var(--automataBlackOpacity);
		border-left: 3px solid var(--automataColor);
		box-shadow: 4px 4px 0 var(--automataBgRGBA);
		text-align: left;
		white-space: normal;
		overflow-wrap: anywhere;
		line-height: 1.6;
		text-transform: none;
		letter-spacing: var(--automataSpacing);
		text-shadow: none;
		transition:
			background-color 140ms ease,
			color 140ms ease;
	}

	.card-index,
	.reason,
	.read-link {
		font-size: var(--font-size-0);
	}

	.card-index {
		opacity: 0.7;
	}

	h3 {
		margin: 0;
		/* Keep the site's fluid heading scale, but not below its link text on phones. */
		font-size: max(1em, var(--font-size-fluid-1));
	}

	.description {
		margin: 0 0 var(--size-3);
	}

	.reason {
		margin: auto 0 0;
		padding-top: var(--size-3);
		border-top: 1px solid var(--automataBlackOpacity);
	}

	.read-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--size-3);
		text-transform: uppercase;
		letter-spacing: 0.3rem;
	}

	.related-card:hover,
	.related-card:focus-visible {
		background-color: var(--automataColor);
		color: var(--automataBg);
		text-decoration: none;
	}

	.related-card:focus-visible {
		outline: 2px solid var(--automataColor) !important;
		outline-offset: 4px;
	}

	.related-card:hover .reason,
	.related-card:focus-visible .reason {
		border-color: var(--automataBgOpacity);
	}

	@media (prefers-reduced-motion: reduce) {
		.related-card {
			transition: none;
		}
	}
</style>
