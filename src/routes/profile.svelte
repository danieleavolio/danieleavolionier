<script lang="ts">
	let pagedata: HTMLElement;

	import { onMount } from 'svelte';
	import Link from '#lib/components/Link.svelte';
	import AvatarPhoto from '#lib/components/ui/AvatarPhoto.svelte';

	onMount(() => {
		let frame = 0;
		const handleMousemove = (e: MouseEvent) => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const rect = pagedata.getBoundingClientRect();
				pagedata.style.setProperty('--left', `${e.clientX - rect.left}px`);
				pagedata.style.setProperty('--top', `${e.clientY - rect.top}px`);
			});
		};
		pagedata.addEventListener('mousemove', handleMousemove);
		return () => {
			pagedata.removeEventListener('mousemove', handleMousemove);
			cancelAnimationFrame(frame);
		};
	});
</script>

<div bind:this={pagedata} class="page-data">
	<div class="top-header">
		<span class="header-square" aria-hidden="true"></span>
		<p>Daniele Avolio - Data Engineer @ AgileLab</p>
	</div>
	<div class="outer-box">
		<div class="inner-box">
			<div class="avatar-frame">
				<AvatarPhoto />
			</div>
			<div class="main-features">
				<p></p>
				<p class="content">
					Ciao, sono <b>Daniele Avolio</b>, <Link href="https://www.linkedin.com/in/danieleavolio/"
						><code>Data Engineer</code></Link
					> presso <Link href="https://agilelab.it/"><code>Agile Lab</code></Link> e laureato magistrale
					in <b>Informatica e Intelligenza Artificiale</b> presso l'<Link
						href="https://www.unical.it/"><code>Università della Calabria</code></Link
					>. Lavoro su pipeline dati scalabili ed ecosistemi Big Data, con forte specializzazione su <Link
						href="https://spark.apache.org/"><code>Apache Spark</code></Link
					>, <Link href="https://www.databricks.com/"><code>Databricks</code></Link>,
					<Link href="https://cloud.google.com/"><code>Google Cloud Platform (GCP)</code></Link>
					e <Link href="https://airflow.apache.org/"><code>Apache Airflow</code></Link>. Ho inoltre
					solida esperienza nel <b>web development</b> (tra cui
					<Link href="https://kit.svelte.dev/"><code>SvelteKit</code></Link> e
					<Link href="https://angular.dev/"><code>Angular</code></Link>), e sono un grande
					appassionato di <b>videogiochi</b> e <b>cultura pop giapponese</b>.
				</p>
				<div class="socials">
					<a target="_blank" class="title" href="https://www.linkedin.com/in/danieleavolio/"
						>LinkedIn</a
					>
					<a target="_blank" href="https://twitter.com/avolio_daniele">Twitter</a>
					<a target="_blank" href="https://github.com/danieleavolio">GitHub</a>
					<a href="mailto:daniele.avolio14@gmail.com">EMAIL</a>
				</div>
				<a href="/cv">CV</a>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		z-index: 20;
	}

	.content :global(a),
	.content :global(code) {
		display: inline;
		padding: 0.04em 0.22em;
		border: 1px solid var(--automataRed);
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: var(--automataColor);
		font-size: 0.85em;
		font-style: normal;
		font-weight: 500;
		letter-spacing: 0.02em;
		line-height: inherit;
		text-transform: none;
		text-shadow: none;
		white-space: normal;
	}

	.content :global(a)::before,
	.content :global(a)::after {
		content: none;
		display: none;
	}

	.content :global(a code) {
		border: 0;
		padding: 0;
		background: transparent;
		color: inherit;
		font-size: inherit;
	}

	.content :global(a):hover,
	.content :global(a):focus-visible {
		background: var(--automataRed);
		color: #1a1815;
	}

	.page-data {
		min-width: 0;
		max-width: 100%;
		overflow-wrap: anywhere;
		--left: 0px;
		--top: 0px;
		position: relative;
		overflow: hidden;
	}

	.page-data::before {
		content: '';
		background: var(--automataWhiteOpacity);
		border-radius: 50%;
		width: 25rem;
		height: 25rem;

		position: absolute;
		left: var(--left);
		top: var(--top);
		transform: translate(-50%, -50%) scale(1.5);
		z-index: -1;
		filter: blur(30px);
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	.page-data:hover::before {
		opacity: 1;
	}

	.top-header {
		padding: 0.1em;
		display: flex;
		align-items: center;
		font-size: var(--font-size-fluid-2);
	}
	.page-data {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--automataBgOpacity);
	}

	.top-header {
		background-color: var(--automataBgRGBA);
		width: 100%;
	}
	.header-square {
		flex: 0 0 auto;
		width: 0.9rem;
		height: 0.9rem;
		margin-right: 0.6rem;
		background-color: var(--automataColor);
	}
	.outer-box {
		min-width: 0;
		max-width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.avatar-frame {
		width: min(var(--size-14), 100%);
		flex: 0 0 auto;
		aspect-ratio: 1 / 1;
	}

	.inner-box {
		min-width: 0;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2em;
		align-items: center;
		height: 100%;
		padding: 0.5rem;
		margin: 0.2em;
		border-top: 1px solid var(--automataBgRGBA);
		border-bottom: 1px solid var(--automataBgRGBA);
	}

	.main-features {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: center;
		gap: 1em;
		margin-bottom: 1em;
	}

	@media (min-width: 1000px) {
		.inner-box {
			flex-direction: row;
			justify-content: center;
			gap: 2em;
			align-items: center;
			height: 100%;
			padding: 0.5rem;
			margin: 0.4em;
			border-top: 1px solid var(--automataBgRGBA);
			border-bottom: 1px solid var(--automataBgRGBA);
		}
		.avatar-frame {
			width: var(--size-14);
		}

		.socials {
			margin-bottom: 0;
		}
	}
</style>
