<script lang="ts">
	import { Square } from 'lucide-svelte';
	let pagedata: HTMLElement;

	import { onMount } from 'svelte';
	import Link from '$lib/components/Link.svelte';

	onMount(() => {
		pagedata.addEventListener('mousemove', (e) => {
			let rect = pagedata.getBoundingClientRect();
			const left = e.clientX - rect.left;
			const top = e.clientY - rect.top;
			pagedata.style.setProperty('--left', `${left}px`);
			pagedata.style.setProperty('--top', `${top}px`);
		});
	});
</script>

<div bind:this={pagedata} class="page-data">
	<div class="top-header">
		<Square />
		<p>Daniele Avolio: Master-student</p>
	</div>
	<div class="outer-box">
		<div class="inner-box">
			<img alt="Daniele Avolio Avatar" src="images/avatar.png" />
			<div class="main-features">
				<p />
				<p class="content">
					Ciao, sono <b>Daniele Avolio</b>, uno studente magistrale in informatica e intelligenza
					artificiale presso l'<Link href="https://www.unical.it/">
						<b>Università della Calabria</b>
					</Link>. Sono appassionato di machine learning e data science. Ho esperienza pregressa
					nello sviluppo frontend con
					<Link href="https://kit.svelte.dev/"><b>SvelteKit</b></Link>
					e <Link href="https://angular.dev/"><b>Angular</b></Link>. Attualmente sto terminando la
					mia laurea magistrale e ho come obiettivo di diventare un <b>Data Scientist</b>!
				</p>
				<div class="socials">
					<a target="_blank" class="title" href="https://www.linkedin.com/in/danieleavolio/"
						>Linkedin</a
					>
					<a target="_blank" href="https://twitter.com/avolio_daniele">Twitter</a>
					<a target="_blank" href="https://github.com/danieleavolio">GitHub</a>
					<a href="mailto:daniele.avolio14@gmail.com">EMAIL</a>
				</div>
				<a target="_blank" href="CV-DA.pdf">CV</a>
			</div>
		</div>
	</div>
</div>

<style>
	a {
		z-index: 20;
	}

	.page-data {
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
	.outer-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	img {
		max-width: var(--size-14);

		max-height: 100%;
		object-fit: cover;
		aspect-ratio: 1/1;
		box-shadow: none;
	}

	.inner-box {
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
			justify-content: start;
			margin-bottom: 0;
		}
	}

</style>
