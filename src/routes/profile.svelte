<script lang="ts">
	let pagedata: HTMLElement;

	import { onMount } from 'svelte';
	import Link from '#lib/components/Link.svelte';

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
			<img
				alt="Daniele Avolio Avatar"
				src="/images/avatar-640.webp"
				srcset="/images/avatar-320.webp 320w, /images/avatar-640.webp 640w"
				sizes="320px"
				width="640"
				height="640"
				fetchpriority="high"
				decoding="async"
			/>
			<div class="main-features">
				<p></p>
				<p class="content">
					Ciao, sono <b>Daniele Avolio</b>, <b><code>Data Engineer</code></b> presso
					<Link href="https://agilelab.it/" target="_blank"><i>Agile Lab</i></Link> e laureato magistrale
					in
					<b>Informatica e Intelligenza Artificiale</b> presso l'<Link
						href="https://www.unical.it/"
					>
						<b>Università della Calabria</b>
					</Link>. Lavoro su pipeline dati scalabili ed ecosistemi Big Data, con forte
					specializzazione su
					<b><code>Apache Spark</code></b>, <b><code>Databricks</code></b>,
					<b><code>Google Cloud Platform (GCP)</code></b>
					e <b><code>Apache Airflow</code></b>. Ho inoltre solida esperienza nel
					<b>web development</b>
					(tra cui
					<Link href="https://kit.svelte.dev/"><b><code>SvelteKit</code></b></Link> e
					<Link href="https://angular.dev/"><b><code>Angular</code></b></Link>), e sono un grande
					appassionato di
					<b>videogiochi</b> e <b>cultura pop giapponese</b>.
				</p>
				<div class="socials">
					<a target="_blank" class="title" href="https://www.linkedin.com/in/danieleavolio/"
						>LinkedIn</a
					>
					<a target="_blank" href="https://twitter.com/avolio_daniele">Twitter</a>
					<a target="_blank" href="https://github.com/danieleavolio">GitHub</a>
					<a href="mailto:daniele.avolio14@gmail.com">EMAIL</a>
				</div>
				<a target="_blank" href="/CV-DA.pdf">CV</a>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		z-index: 20;
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

	img {
		max-width: min(var(--size-14), 100%);

		max-height: 100%;
		object-fit: cover;
		aspect-ratio: 1/1;
		box-shadow: none;
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
		img {
			width: var(--size-14);
			height: 100%;
			object-fit: cover;
			aspect-ratio: 1/1;
		}

		.socials {
			margin-bottom: 0;
		}
	}
</style>
