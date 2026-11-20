<script lang="ts">
	import Seo from '#lib/components/SEO.svelte';

	const skills = {
		'Data engineering':
			'Apache Spark, PySpark, Apache Airflow, Databricks, GCP, Azure, Hadoop (HDFS, Hive), Delta Lake, Mulesoft, Cobrix, ETL, SQL, NoSQL',
		'Machine learning e AI':
			'Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch, Transformers, LLM, OpenAI API, Gradio, Matplotlib, NLTK',
		Programmazione:
			'Python, Java, C++, JavaScript, TypeScript, COBOL, DataWeave, Bash, Docker, Git, Node.js, Streamlit, Angular, Tailwind CSS',
		Lingue: 'Italiano (madrelingua), inglese (fluente)'
	};
</script>

<Seo
	title="CV — Daniele Avolio, Data Engineer"
	description="Curriculum di Daniele Avolio, Data Engineer ad AgileLab. Esperienza in Apache Spark, Databricks, Airflow, Azure, GCP, Python, Angular e progetti di data analysis."
/>

<article class="cv yr-panel">
	<h2 class="yr-panel__head">
		<span class="yr-panel__square" aria-hidden="true"></span>Curriculum
	</h2>
	<div class="cv-body">
		<header>
			<h1>Daniele Avolio</h1>
			<p class="role">Data Engineer</p>
			<p class="contacts">
				<a href="tel:+393895996313">+39 389 599 6313</a> ·
				<a href="mailto:daniele.avolio14@gmail.com">daniele.avolio14@gmail.com</a> ·
				<a href="https://www.danieleavolio.it">danieleavolio.it</a> ·
				<a href="https://github.com/danieleavolio">GitHub</a> ·
				<a href="/CV-DA.pdf" target="_blank" rel="noopener">Scarica il PDF</a>
			</p>
		</header>

		<section>
			<h2>Esperienza</h2>

			<div class="entry">
				<h3>Data Engineer, AgileLab</h3>
				<p class="meta">Rende, Calabria (remoto) · luglio 2025 - oggi</p>
				<ul>
					<li>
						Costruzione di pipeline di integrazione per sistemi legacy con Apache Spark, Java e
						Cobrix per il parsing dei copybook COBOL.
					</li>
					<li>Orchestrazione dei flussi di produzione con Apache Airflow.</li>
					<li>Manutenzione delle pipeline e risoluzione delle integrazioni con dati legacy.</li>
					<li>
						Automazione della generazione dei flussi dati, con riduzione dei tempi di sviluppo.
					</li>
				</ul>
				<p class="tech">Apache Spark, Java, Cobrix, COBOL, Apache Airflow, Git</p>
			</div>

			<div class="entry">
				<h3>Data Engineer e integrazione, Lutech S.p.A.</h3>
				<p class="meta">Cosenza, Calabria · ottobre 2024 - luglio 2025</p>
				<ul>
					<li>Migrazione di ETL legacy verso Databricks e SQL su Azure.</li>
					<li>Ottimizzazione delle trasformazioni XSLT interne con DataWeave.</li>
					<li>
						Strumenti interni e integrazione con OpenAI API per automatizzare attività manuali, con
						un risparmio del 50% del tempo di processing.
					</li>
				</ul>
				<p class="tech">
					Python, Databricks, SQL, PySpark, Azure, Mulesoft, DataWeave, OpenAI API, Streamlit
				</p>
			</div>

			<div class="entry">
				<h3>Frontend developer, IET s.r.l.</h3>
				<p class="meta">Rende, Calabria · maggio 2022 - agosto 2022</p>
				<ul>
					<li>
						Progettazione di una libreria Angular Material interna per i componenti delle
						applicazioni aziendali.
					</li>
					<li>
						Sviluppo di applicazioni con Angular e Tailwind CSS, inclusi questionari personalizzati
						senza servizi di terze parti.
					</li>
					<li>Refactoring di codebase esistenti e aggiunta di nuove funzionalità scalabili.</li>
				</ul>
			</div>
		</section>

		<section>
			<h2>Formazione</h2>

			<div class="entry">
				<h3>Laurea magistrale in Informatica e Intelligenza Artificiale, Unical</h3>
				<p class="meta">Cosenza · settembre 2022 - aprile 2025 · 110/110</p>
				<p>
					Percorso su intelligenza artificiale, data engineering e Big Data, con machine learning,
					deep learning e architetture dati. Tesi sull'integrazione di LLM nei processi di
					migrazione e integrazione dei dati.
				</p>
			</div>

			<div class="entry">
				<h3>Erasmus+, Instituto Superior Técnico</h3>
				<p class="meta">Lisbona · febbraio 2024 - luglio 2024</p>
				<p>
					Corsi avanzati di informatica e intelligenza artificiale, con focus su machine e deep
					learning, e contatti internazionali con studenti e docenti.
				</p>
			</div>

			<div class="entry">
				<h3>Laurea triennale in Informatica, Unical</h3>
				<p class="meta">Cosenza · settembre 2018 - aprile 2022 · 94/110</p>
				<p>
					Base su programmazione, ingegneria del software, sviluppo web e intelligenza artificiale.
					Tesi su un'applicazione web full stack per la gestione di una rete sociale studentesca.
				</p>
			</div>
		</section>

		<section>
			<h2>Progetti</h2>

			<div class="entry">
				<h3>Reddit Post Analyzer</h3>
				<p class="meta">Progetto personale</p>
				<p>
					App Streamlit per cercare post Reddit, salvarli in SQLite e analizzarli. Pipeline NLP per
					sentiment, andamento dei punteggi e attività dei subreddit.
				</p>
				<p class="tech">Python, Streamlit, SQLite, Pandas, NLTK, Scikit-learn, Plotly</p>
			</div>

			<div class="entry">
				<h3>MoodWheel Android App</h3>
				<p class="meta">Progetto personale</p>
				<p>
					Tracker delle emozioni locale e privacy-first, con architettura MVVM, StateFlow e una
					"ruota delle emozioni" disegnata con Compose Canvas.
				</p>
				<p class="tech">Kotlin, Jetpack Compose, Room, MVVM, Android SDK</p>
			</div>

			<div class="entry">
				<h3>Immersivaudio</h3>
				<p class="meta">Instituto Superior Técnico</p>
				<p>
					Generazione audio da video e immagini con modelli di deep learning, distribuiti su Hugging
					Face Spaces tramite Gradio.
				</p>
				<p class="tech">Python, PyTorch, Gradio, Hugging Face, Transformers</p>
			</div>

			<div class="entry">
				<h3>Chants of Sennaar Phrases</h3>
				<p class="meta">Progetto open source</p>
				<p>
					Web app per creare frasi con i glifi del gioco Chants of Sennaar e esportarle in più
					formati.
				</p>
				<p class="tech">JavaScript, SvelteKit, Node.js, Python</p>
			</div>
		</section>

		<section>
			<h2>Competenze</h2>
			{#each Object.entries(skills) as [label, value]}
				<div class="entry compact">
					<h3>{label}</h3>
					<p>{value}</p>
				</div>
			{/each}
		</section>

		<section>
			<h2>Certificazioni e riconoscimenti</h2>
			<ul>
				<li>2026: Google Cloud Digital Leader</li>
				<li>2023: miglior studente del master in Informatica e Intelligenza Artificiale, Unical</li>
			</ul>
		</section>
	</div>
</article>

<style>
	.cv {
		max-inline-size: 820px;
		margin-inline: auto;
	}
	.cv-body {
		padding: 1.25rem;
	}
	h1 {
		margin: 0;
	}
	.role {
		margin-top: 0.2rem;
		color: var(--text-2);
	}
	.contacts {
		margin-top: 0.6rem;
		font-size: 0.9rem;
	}
	section {
		margin-top: 1.75rem;
	}
	section h2 {
		font-size: var(--font-size-fluid-1);
		margin-bottom: 0.8rem;
	}
	.entry {
		margin-bottom: 1.25rem;
	}
	.entry h3 {
		font-size: 1.05rem;
		margin: 0;
	}
	.meta {
		margin: 0.2rem 0 0.4rem;
		color: var(--text-2);
		font-size: 0.85rem;
	}
	.entry p {
		margin: 0.4rem 0 0;
	}
	.entry ul {
		margin: 0.4rem 0 0;
		padding-left: 1.2rem;
		list-style: disc;
	}
	.entry li {
		margin-bottom: 0.3rem;
		padding: 0;
		background-image: none;
	}
	.tech {
		font-size: 0.85rem;
		opacity: 0.85;
	}
	.compact {
		margin-bottom: 0.8rem;
	}
</style>
