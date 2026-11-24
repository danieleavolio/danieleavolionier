<script lang="ts">
	import * as config from '#lib/config.ts';

	const year = new Date().getFullYear();

	const navigate = [
		{ href: '/pagine', label: 'Blog' },
		{ href: '/progetti', label: 'Progetti' },
		{ href: '/now', label: 'Now' },
		{ href: '/data', label: 'Data' },
		{ href: '/appunti', label: 'Appunti' },
		{ href: '/cv', label: 'CV' }
	];

	const contacts = [
		{ href: 'https://www.linkedin.com/in/danieleavolio/', label: 'LinkedIn', external: true },
		{ href: 'https://github.com/danieleavolio', label: 'GitHub', external: true },
		{ href: 'https://twitter.com/avolio_daniele', label: 'Twitter', external: true },
		{ href: 'mailto:daniele.avolio14@gmail.com', label: 'Email', external: false }
	];

	const feed = [
		{ href: '/rss.xml', label: 'RSS' },
		{ href: '/privacy-policy', label: 'Privacy' }
	];

	function scrollToTop() {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
	}
</script>

<footer class="site-footer yr-panel">
	<div class="yr-panel__head">
		<span class="yr-panel__square" aria-hidden="true"></span>
		<span>YoRHa // Info</span>
	</div>

	<div class="grid">
		<section class="identity" aria-label="Chi sono">
			<p class="name">{config.title}</p>
			<p class="role"><span class="yr-badge yr-badge--solid">{config.role}</span></p>
			<p class="tagline">Scrivo di dati, codice e videogiochi.</p>
		</section>

		<nav aria-label="Naviga">
			<p class="yr-eyebrow">Naviga</p>
			<ul>
				{#each navigate as item (item.href)}
					<li><a href={item.href}>{item.label}</a></li>
				{/each}
			</ul>
		</nav>

		<nav aria-label="Contatti">
			<p class="yr-eyebrow">Contatti</p>
			<ul>
				{#each contacts as item (item.href)}
					<li>
						<a
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={item.external ? 'noopener' : undefined}>{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<nav aria-label="Feed e note legali">
			<p class="yr-eyebrow">Feed</p>
			<ul>
				{#each feed as item (item.href)}
					<li><a href={item.href}>{item.label}</a></li>
				{/each}
			</ul>
		</nav>
	</div>

	<div class="strip">
		<p class="copy">&copy; {year} Daniele Avolio</p>
		<p class="status yr-mono">
			<span class="blink" aria-hidden="true"></span>YoRHa // SISTEMA ONLINE
		</p>
		<button type="button" class="yr-button" onclick={scrollToTop}>Torna su</button>
	</div>
</footer>

<style>
	.site-footer {
		margin-block: var(--size-7, 3rem) var(--size-4, 1.5rem);
		color: var(--automataColor);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.5rem 2rem;
		padding: 1.25rem 1.1rem;
	}

	.identity {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.identity p,
	nav p {
		margin: 0;
	}

	.name {
		font-size: 1.15rem;
		font-weight: 500;
		letter-spacing: 0.08rem;
	}

	.tagline {
		font-size: 0.9rem;
		line-height: 1.5;
		max-inline-size: 28ch;
	}

	nav .yr-eyebrow {
		padding-bottom: 0.45rem;
		margin-bottom: 0.55rem;
		border-bottom: 1px solid var(--yr-line);
		opacity: 1;
		color: var(--automataColor);
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
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

	li a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 1.8rem;
		padding: 0 0.35rem;
		border: 0;
		background-color: transparent;
		color: var(--automataColor);
		font-size: 0.9rem;
		letter-spacing: 0.04rem;
		text-transform: none;
		text-decoration: none;
		text-shadow: none;
	}

	li a::before {
		content: '';
		position: static;
		display: block;
		inset: auto;
		width: 0.35rem;
		height: 0.35rem;
		background-color: currentColor;
		opacity: 0.45;
		transition: none;
	}

	li a::after {
		display: none;
	}

	li a:hover,
	li a:focus-visible {
		background-color: var(--yr-accent);
		color: var(--automataBg);
	}

	li a:hover::before,
	li a:focus-visible::before {
		opacity: 1;
	}

	a:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--yr-focus);
		outline-offset: 2px;
	}

	.strip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1.5rem;
		padding: 0.75rem 1.1rem;
		border-top: 1px solid var(--yr-line);
	}

	:global(html[data-theme='dark']) .strip {
		border-top-color: var(--automataColor);
	}

	.strip p {
		margin: 0;
		font-size: 0.82rem;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		letter-spacing: 0.12rem;
		text-transform: uppercase;
	}

	.blink {
		width: 0.5rem;
		height: 0.5rem;
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

	@media (max-width: 960px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.25rem;
		}

		.grid ul {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 1rem;
		}

		.strip {
			flex-direction: column;
			align-items: flex-start;
		}

		.strip .yr-button {
			width: 100%;
		}
	}
</style>
