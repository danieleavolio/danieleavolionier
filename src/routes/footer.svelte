<script lang="ts">
	import * as config from '#lib/config.ts';
	import { i18n } from '#lib/i18n-state.ts';

	const year = new Date().getFullYear();

	// Only links the header does not already show.
	const links = [
		{ href: '/cv', label: 'CV', external: false },
		{ href: 'https://www.linkedin.com/in/danieleavolio/', label: 'LinkedIn', external: true },
		{ href: 'https://github.com/danieleavolio', label: 'GitHub', external: true },
		{ href: 'https://twitter.com/avolio_daniele', label: 'Twitter', external: true },
		{ href: 'mailto:daniele.avolio14@gmail.com', label: 'Email', external: false },
		{ href: '/rss.xml', label: 'RSS', external: false },
		{ href: '/privacy-policy', label: 'Privacy', external: false }
	];

	const hrefFor = (item: { href: string; label: string }) =>
		item.label === 'RSS' && i18n.lang === 'en' ? '/en/rss.xml' : item.href;

	function scrollToTop() {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
	}
</script>

<footer class="site-footer">
	<div class="main">
		<p class="identity">
			<span class="name">{config.title}</span>
			<span class="yr-badge yr-badge--muted">{config.role}</span>
		</p>
		<nav aria-label="Link utili">
			<ul>
				{#each links as item (item.href)}
					<li>
						<a
							href={hrefFor(item)}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener' : undefined}>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<div class="strip">
		<p>&copy; {year} Daniele Avolio</p>
		<p class="status yr-mono">
			<span class="blink" aria-hidden="true"></span>{i18n.t.systemOnline}
		</p>
		<button type="button" class="top" onclick={scrollToTop}>Torna su ↑</button>
	</div>
</footer>

<style>
	.site-footer {
		margin-block: var(--size-8, 3rem) var(--size-4, 1.5rem);
		padding-top: 1rem;
		border-top: 2px solid var(--automataColor);
		color: var(--automataColor);
		font-size: 0.85rem;
	}

	p,
	a,
	.top {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.site-footer nav ul li a {
		font-size: 0.85rem;
	}

	.strip p,
	.strip .top {
		font-size: 0.75rem;
	}

	.main,
	.strip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem 1.5rem;
	}

	.identity {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}

	.name {
		font-size: 1rem;
		letter-spacing: 0.08rem;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		margin: 0;
		padding: 0;
		background-image: none;
		max-inline-size: none;
	}

	a,
	.top {
		display: inline-flex;
		align-items: center;
		min-height: 1.8rem;
		padding: 0 0.5rem;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: var(--automataColor);
		font: inherit;
		letter-spacing: 0.06rem;
		text-transform: none;
		text-decoration: none;
		text-shadow: none;
		cursor: pointer;
	}

	a::before,
	a::after {
		display: none;
	}

	a:hover,
	a:focus-visible,
	.top:hover,
	.top:focus-visible {
		background-color: var(--yr-accent);
		color: var(--automataBg);
	}

	a:focus-visible,
	.top:focus-visible {
		outline: 2px solid var(--yr-focus);
		outline-offset: 2px;
	}

	.strip {
		margin-top: 0.75rem;
		padding-top: 0.6rem;
		border-top: 1px dashed var(--yr-line);
		font-size: 0.78rem;
		opacity: 0.85;
	}

	:global(html[data-theme='dark']) .strip {
		border-top-color: var(--automataColor);
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		letter-spacing: 0.12rem;
		text-transform: uppercase;
	}

	.blink {
		width: 0.45rem;
		height: 0.45rem;
		background-color: var(--automataRed);
		animation: footer-blink 1.4s steps(2, start) infinite;
	}

	@keyframes footer-blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blink {
			animation: none;
		}
	}

	@media (max-width: 560px) {
		.main,
		.strip {
			flex-direction: column;
			align-items: flex-start;
		}

		ul {
			margin-left: -0.5rem;
		}
	}
</style>
