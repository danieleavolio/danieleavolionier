<h1>Admin Dashboard</h1>
<p>Benvenuto nel pannello di gestione dei contenuti. Seleziona una sezione per iniziare:</p>

<div class="dashboard-links">
	<a class="dashboard-card" href="/admin/posts">
		<h2>📝 Posts</h2>
		<p>Crea e modifica articoli con l'editor visuale.</p>
	</a>
	<a class="dashboard-card" href="/admin/projects">
		<h2>💼 Progetti</h2>
		<p>Gestisci i progetti del portfolio.</p>
	</a>
	<a class="dashboard-card" href="/admin/now">
		<h2>⚡ Now</h2>
		<p>Aggiorna le attività correnti.</p>
	</a>
</div>

<style>
	.dashboard-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-top: 1.5rem;
	}
	.dashboard-card {
		display: block;
		padding: 1.5rem;
		border: 1px solid var(--automataColor);
		text-decoration: none;
		color: inherit;
		background: var(--automataBgRGBA);
		transition: transform 0.15s ease;
	}
	.dashboard-card:hover {
		transform: translateY(-2px);
		background: var(--automataBg);
	}
	.dashboard-card h2 {
		margin-top: 0;
		font-size: 1.25rem;
	}
	.dashboard-card p {
		margin-bottom: 0;
		font-size: 0.9rem;
		opacity: 0.85;
	}
</style>
