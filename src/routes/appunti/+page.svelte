<script lang="ts">
	import NotesHolder from '$lib/components/NotesHolder.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

    const notes = [
        {
            title: 'Theoretical Computer Science',
            description: 'Domande e risposte delle slides',
            downloadLink: 'files/q&a.pdf'
        }
    ]
</script>

<div class="page">
	<div class="title">
		<h1>Notes | Appunti</h1>
		<i
			>In this page you will find my nothes on the courses I followed at the University of Calabria,
			both in Italian and English. Probably there will not be a lot of Bachelor's notes since I
			started to take notes in my first year of Master's degree.
            <br />
            Note that the notes are not complete and may contain errors. Do not rely 100% on them and 
            always refer to the official material provided by the professors. Enjoy!
		</i>
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

	.title {
		text-align: center;
	}

    .notes{
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
