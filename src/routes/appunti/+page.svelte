<script lang="ts">
	import NotesHolder from '#lib/components/NotesHolder.svelte';
	import Highlit from '#lib/components/Highlit.svelte';
	import Seo from '#lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let category = $state('Tutti');
	let query = $state('');

	const categories = $derived(['Tutti', ...new Set(data.notes.map((note) => note.category))]);
	const groups = $derived.by(() => {
		const term = query.trim().toLowerCase();
		const visible = data.notes.filter(
			(note) =>
				(category === 'Tutti' || note.category === category) &&
				(!term || `${note.title} ${note.description}`.toLowerCase().includes(term))
		);
		return [...new Set(visible.map((note) => note.category))].map(
			(name) => [name, visible.filter((note) => note.category === name)] as const
		);
	});
</script>

<Seo
	title="Appunti Universitari Informatica Unical"
	description="Raccolta gratuita di appunti universitari per il corso di laurea in Informatica (Triennale e Magistrale) all'Università della Calabria: Machine Learning, Statistica, Big Data e molto altro."
/>

<div class="page">
	<div class="title">
		<h1>Appunti</h1>
		<i>
			Appunti di Unical Informatica, sia Magistrale che Triennale. Puoi trovare appunti di vari
			corsi, tra cui: <b>Machine Learning, Statistica, ecc.</b>
			<br />
			Nota che gli appunti non sono completi e potrebbero contenere errori. Non fare affidamento al 100%
			su di essi e consulta sempre il materiale ufficiale fornito dai professori. Ci tengo a specificare
			che gli <b>appunti sono 100% gratuiti!</b> Mi raccomando, buona fortuna per gli esami!
		</i>

		<Highlit type="warning">
			<p>
				<b>Nota:</b> Alcuni appunti possono contenere screen di slide o materiale didattico fornito dai
				professori. Se un professore ritiene che il materiale violi i suoi diritti d'autore o che gli
				dia noia, mi contatti e provvedero a rimuoverlo immediatamente!
			</p>
			<a href="mailto:daniele.avolio14@gmail.com">
				<span class="material-symbols-outlined"> warning </span>Contattami
			</a>
		</Highlit>
	</div>

	<div class="controls">
		<div class="chips" role="group" aria-label="Categoria">
			{#each categories as name (name)}
				<button
					type="button"
					class="chip"
					aria-pressed={category === name}
					onclick={() => (category = name)}>{name}</button
				>
			{/each}
		</div>
		<input
			type="search"
			class="search"
			placeholder="Cerca negli appunti"
			aria-label="Cerca negli appunti"
			bind:value={query}
		/>
	</div>

	{#each groups as [name, items] (name)}
		<section class="group" aria-label={name}>
			<h2>{name}</h2>
			<div class="notes">
				{#each items as note (note.id)}
					<NotesHolder
						title={note.title}
						description={note.description}
						category={note.category}
						downloadLink={note.file_url}
						isPdf={Boolean(note.file_path) || note.file_url.startsWith('/files/')}
					/>
				{/each}
			</div>
		</section>
	{:else}
		<p class="empty" role="status">Nessun appunto trovato.</p>
	{/each}
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		height: 100%;
	}

	a {
		display: flex;
		justify-content: center;
		width: fit-content;
		margin: auto;
	}

	.title {
		text-align: center;
		text-justify: inter-word;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem 1.5rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		min-height: 2.25rem;
		padding: 0.2rem 0.9rem;
		border: 1px solid var(--automataColor);
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		color: inherit;
		font: inherit;
		letter-spacing: 0.08rem;
		text-transform: uppercase;
		cursor: pointer;
	}

	.chip:hover {
		background-color: var(--automataColor);
		color: var(--automataBg);
	}

	.chip[aria-pressed='true'] {
		background-color: var(--automataColor);
		color: var(--automataBg);
	}

	.search {
		border-radius: 0;
		box-shadow: none;
		flex: 1 1 14rem;
		max-width: 22rem;
	}

	.group h2 {
		margin: 0 0 1rem;
	}

	.empty {
		text-align: center;
		opacity: 0.75;
	}

	.notes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
		gap: 1.5rem;
	}
</style>
