<script lang="ts">
	import NotesHolder from '$lib/components/NotesHolder.svelte';
	import type { PageData } from './$types';
	import { notes } from '$lib/notes_files_desc';
	import Highlit from '$lib/components/Highlit.svelte';
	export let data: PageData;
	import * as config from "$lib/config"
</script>

<svelte:head>
	<title>{config.title} Appunti</title>
</svelte:head>

<div class="page">
	<div class="title">
		<h1>Appunti</h1>
		<i>
			In questa pagina troverai i miei appunti sui corsi seguiti presso l'Università della Calabria,
			sia in italiano che in inglese. Probabilmente non ci saranno molti appunti del corso di laurea
			triennale poiché ho iniziato a prendere appunti nel mio primo anno di laurea magistrale.
			<br />
			Nota che gli appunti non sono completi e potrebbero contenere errori. Non fare affidamento al 100%
			su di essi e consulta sempre il materiale ufficiale fornito dai professori. Ci tengo a specificare che gli <b>appunti 
            sono 100% gratuiti!</b> Mi raccomando, buona fortuna per gli esami!
		</i>

		<Highlit type="warning">
			<p>
				<b>Nota:</b> Alcuni appunti possono contenere screen di slide o materiale didattico fornito dai
				professori. Se un professore ritiene che il materiale violi i suoi diritti d'autore o che gli dia noia, mi contatti
				e provvederò a rimuoverlo immediatamente!
			</p>
			<a href="mailto:daniele.avolio14@gmail.com">
				<span class="material-symbols-outlined"> warning </span>Contattami
			</a>
		</Highlit>
	</div>

	<div class="notes">
		{#each notes as note}
			<NotesHolder
				title={note.title}
				description={note.description}
				downloadLink={note.downloadLink}
			/>
		{/each}
	</div>
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

	.notes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
</style>
