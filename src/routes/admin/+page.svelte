<svelte:head><title>Admin | Daniele Avolio</title></svelte:head>

<div class="dashboard">
	<header class="intro">
		<p class="yr-eyebrow">Pannello di gestione</p>
		<h1>Dashboard</h1>
		<p>Scegli la sezione da modificare.</p>
	</header>

	<div class="sections">
		<section class="yr-panel">
			<h2 class="yr-panel__head"><span class="yr-panel__square"></span>01 // Posts</h2>
			<div class="yr-panel__body">
				<p>Scrivi e aggiorna gli articoli con l'editor visuale, le categorie e la copertina.</p>
				<a class="yr-button yr-button--primary" href="/admin/posts">Apri i post</a>
			</div>
		</section>
		<section class="yr-panel">
			<h2 class="yr-panel__head"><span class="yr-panel__square"></span>02 // Progetti</h2>
			<div class="yr-panel__body">
				<p>Gestisci le schede del portfolio: testo, immagini e stato di pubblicazione.</p>
				<a class="yr-button yr-button--primary" href="/admin/projects">Apri i progetti</a>
			</div>
		</section>
		<section class="yr-panel">
			<h2 class="yr-panel__head"><span class="yr-panel__square"></span>03 // Now</h2>
			<div class="yr-panel__body">
				<p>Tieni aggiornate le attività in corso, con stato, link e ordine.</p>
				<a class="yr-button yr-button--primary" href="/admin/now">Apri Now</a>
			</div>
		</section>
		<section class="yr-panel">
			<h2 class="yr-panel__head"><span class="yr-panel__square"></span>04 // Appunti</h2>
			<div class="yr-panel__body">
				<p>Gestisci gli appunti: categorie, link esterni e PDF caricati.</p>
				<a class="yr-button yr-button--primary" href="/admin/appunti">Apri gli appunti</a>
			</div>
		</section>
	</div>

	<section class="yr-panel">
		<h2 class="yr-panel__head"><span class="yr-panel__square"></span>Scorciatoie</h2>
		<div class="yr-panel__body shortcuts">
			<a class="yr-button yr-button--ghost" href="/">Home</a>
			<a class="yr-button yr-button--ghost" href="/sitemap.xml">Sitemap</a>
			<a class="yr-button yr-button--ghost" href="/rss.xml">RSS</a>
		</div>
	</section>
</div>

<style>
	.dashboard {
		display: grid;
		gap: 1.25rem;
	}
	.intro h1 {
		margin: 0.15rem 0 0.25rem;
		font-size: clamp(1.5rem, 2.4vw, 2.1rem);
		letter-spacing: 0.15rem;
	}
	.intro p:last-child {
		margin: 0;
		opacity: 0.8;
	}
	.sections {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.25rem;
	}
	.sections .yr-panel {
		display: flex;
		flex-direction: column;
	}
	.sections .yr-panel__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.1rem;
	}
	.sections p {
		flex: 1;
		margin: 0;
	}
	.shortcuts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
