<script lang="ts">
	import Seo from '#lib/components/SEO.svelte';

	const skills = [
		'Apache Spark',
		'Databricks',
		'Google Cloud Platform (GCP)',
		'Apache Airflow',
		'SvelteKit',
		'Svelte',
		'Angular',
		'TypeScript',
		'Node.js',
		'Python'
	];
</script>

<Seo
	title="CV — Daniele Avolio, Data Engineer"
	description="Curriculum di Daniele Avolio, Data Engineer ad AgileLab: esperienza con Apache Spark, Databricks, GCP, Airflow e sviluppo web con SvelteKit e Angular."
/>

<article class="cv yr-panel">
	<h2 class="yr-panel__head">
		<span class="yr-panel__square" aria-hidden="true"></span>Curriculum
	</h2>
	<div class="cv-body">
		<h1>Daniele Avolio</h1>
		<p class="role">Data Engineer @ Agile Lab</p>

		<section>
			<h2>Profilo</h2>
			<p>
				Data Engineer con laurea magistrale in Informatica e Intelligenza Artificiale presso
				l'Università della Calabria. Lavoro su pipeline dati scalabili ed ecosistemi Big Data, con
				esperienza nello sviluppo web e passione per videogiochi e cultura pop giapponese.
			</p>
		</section>

		<section>
			<h2>Competenze</h2>
			<ul class="skills">
				{#each skills as skill}
					<li>{skill}</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2>Esperienza e formazione</h2>
			<ul class="timeline">
				<li><b>Data Engineer</b> — Agile Lab</li>
				<li>
					<b>Laurea magistrale</b> — Informatica e Intelligenza Artificiale, Università della Calabria
				</li>
				<li><b>Sviluppo web</b> — SvelteKit, Angular, TypeScript</li>
			</ul>
		</section>

		<section>
			<h2>Contatti</h2>
			<p>
				<a href="https://www.linkedin.com/in/danieleavolio/" target="_blank" rel="noopener"
					>LinkedIn</a
				>
				· <a href="https://github.com/danieleavolio" target="_blank" rel="noopener">GitHub</a> ·
				<a href="mailto:daniele.avolio14@gmail.com">Email</a> ·
				<a href="/CV-DA.pdf" target="_blank" rel="noopener">Scarica il PDF</a>
			</p>
		</section>
	</div>
</article>

<style>
	.cv {
		max-inline-size: 760px;
		margin-inline: auto;
	}
	.cv-body {
		padding: 1.25rem;
	}
	h1 {
		margin: 0;
	}
	.role {
		margin-top: 0.3rem;
		color: var(--text-2);
	}
	section {
		margin-top: 1.5rem;
	}
	section h2 {
		font-size: var(--font-size-fluid-0);
		margin-bottom: 0.5rem;
	}
	.skills,
	.timeline {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.skills li {
		margin: 0;
		padding: 0.2rem 0.5rem;
		border: 1px solid var(--yr-line);
		background: var(--yr-muted);
	}
	.timeline {
		flex-direction: column;
	}
	.timeline li {
		margin: 0;
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--yr-line);
	}
</style>
