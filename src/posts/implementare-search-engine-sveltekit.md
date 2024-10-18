---
title: Come implementare un motore di ricerca in SvelteKit
description: Cercare all'interno del proprio sito web potrebbe essere necessario per rendere più facile la navigazione ai propri utenti. Wow in SvelteKit non è poi cosi difficile!
date: "10-18-2024"
categories: 
    - programmazione
    - web
    - blog
    - sveltekit
published: true
---

`Premessa`: Questo articolo è stato scritto dopo aver implementato dopo aver seguito la seguente guida: [How To Make A Blazing Fast SvelteKit Search](https://joyofcode.xyz/blazing-fast-sveltekit-search). Questo articolo è una traduzione e riadattamento di quanto scritto in quella guida, dopo averlo applicato al mio sito web.

![Motore di ricerca](https://i.imgur.com/LviXblo.gif)
<center>Esempio di motore di ricerca in SvelteKit </center>

## Dipendenze

Per implementare un motore di ricerca in SvelteKit, avremo bisogno di un'unica **dipendenza**: `flexsearch`. Questa libreria sarà quella che ci permetterà di effettuare la ricerca all'interno del nostro sito web in base al contenuto dei nostri articoli o pagine.

```bash
npm install flexsearch
```

## Struttura del filesystem

La struttura che ci serve per far funzionare il motore di ricerca è la seguente:

```
src/
├── lib/
│   └── search.ts
└── routes/
    ├── search.json/
    │   └── +server.ts
    └── +page.svelte
```

Dove:

- `search.ts` è il file che conterrà l'**index** e la **funzione di ricerca**.
- `search.json` è un **endpoint** che ci servirà per pre-renderizzare i risultati della ricerca come un `json`, e questo ci permetterà di evitare di salvarci un file `json` manualmente.
- `+page.svelte` è la pagina che conterrà il nostro motore di ricerca, poi potete farlo comparire dove volete.

## Implementazione

#### `search.ts`

```typescript
import type { Element } from '$lib/types';
import { json } from '@sveltejs/kit';


export const prerender = true

export async function GET({fetch}) {

    // Fetch dei post
    const response = await fetch('api/posts');
    const posts: Element[] = await response.json();

    // Aggiunta poiché ho 2 tipi di pagine
    posts.forEach(post => {
        post.slug = 'pagine/' + post.slug;
    });

    // Fetch dei progetti
    const res2 = await fetch('api/progetti');
    const progetti: Element[] = await res2.json();

    progetti.forEach(post => {
        post.slug = 'progetti/' + post.slug;
    });


    // Ritorno dei dati come JSON
    return json({ posts, progetti});
}
```

`Nota`: Io ho già un endpoint che mi ritorna tutti i post e i progetti, quindi ho usato quello. Se non avete un endpoint simile, potete creare un file `api/posts.ts` e `api/progetti.ts` che ritornano i post e i progetti, poiché i miei file che contengono i post sono in **markdown** e sono salvati proprio come file `.md`, non li prendo da nessuna API esterna.

#### `search.json`

```typescript
import FlexSearch from 'flexsearch'
import type { Element } from '$lib/types';


let postsIndex: FlexSearch.Index
let posts: Element[]

export function createIndex(data: any) {
    // Crea un indice di ricerca per i post

    // Tokenize 'forward' per accettare anche le ricerche parziali
    // mentre per le ricerche esatte si può usare 'strict'
    postsIndex = new FlexSearch.Index({ tokenize: 'forward' })


    // Join perché ho sia i post che i progetti
    data = data.posts.concat(data.progetti);
    
    data.forEach((post: { title: any; description: any; }, i: FlexSearch.Id) => {

        // Crea un item con il titolo e la descrizione del post
        const item = `${post.title} ${post.description}`

        // Aggiungi l'item all'indice
        postsIndex.add(i, item)
    })

    posts = data
}

    export function searchPostsIndex(searchTerm: string) {
    // escape special regex characters
    const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // return matching post indexes 💪
    const results = postsIndex.search(match)

    return results
        // filter the posts based on the matched index
        .map((index) => posts[index as number])
        // you can do whatever you want at this point 👌
        .map(({ slug, title, description }) => {
            return {
                slug,
                // replace match in title with a marker
                title: replaceTextWithMarker(title, match),
                // match words in post and replace matches with marker
                content: getMatches(description, match, 3)
            }
        })
}


function getMatches(text: string, searchTerm: string, limit = 1) {
    // Regex per la ricerca
    const regex = new RegExp(searchTerm, 'gi')
    // Indici
    const indexes = []
    // Matches
    let matches = 0
    // Loop per trovare i match
    let match
    while ((match = regex.exec(text)) !== null && matches < limit) {
        // Aggiungi l'indice
        indexes.push(match.index)
        // Incrementa i match
        matches++
    }

    // Ritorna l'array di indici
    return indexes.map((index) => {
        // Vai indietro di 20 caratteri
        const start = index - 20
        // Vai avanti di 80 caratteri
        const end = index + 80
        // Estrai il testo
        const excerpt = text.substring(start, end).trim()
        // Ritorna l'estratto con i match
        return `...${replaceTextWithMarker(excerpt, searchTerm)}...`
    })
}

function replaceTextWithMarker(text: string, match: string) {
    // Regex per la ricerca
    const regex = new RegExp(match, 'gi')
    // Ritorna il testo con il match evidenziato
    return text.replaceAll(regex, (match) => `<mark>${match}</mark>`)
}
```

Praticamente, quello che succede è che:

1. Creiamo un indice di ricerca per i post e i progetti.
2. Creiamo una funzione che ci permette di cercare all'interno dell'indice.
3. Creiamo una funzione che ci permette di evidenziare i match all'interno del testo.
4. Creiamo una funzione che ci permette di ottenere i match all'interno del testo.
5. Ritorniamo i risultati.

#### `Componente di ricerca`

```typescript
<script lang="ts">
	import { createIndex, searchPostsIndex } from '$lib/search';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import { goto } from '$app/navigation';

	let search: 'loading' | 'ready' = 'loading';
	let searchTerm = '';
	let results: any[] = [];
	let showModal = false;
	let dialog: HTMLDialogElement;

	onMount(async () => {

        // Prendi i post dall'endpoint
		const posts = await fetch('/search.json').then((res) => res.json());
        // Crea l'indice di ricerca
		createIndex(posts);
        // Setta lo stato a 'ready' e siamo pronti
		search = 'ready';
	});

	$: if (search === 'ready') {
        // Cerca all'interno dell'indice
		results = searchPostsIndex(searchTerm);
	}
</script>

<div class="search-icon">
	<button on:click={() => (showModal = !showModal)}>
		<span class="material-symbols-outlined"> search </span>
	</button>
</div>


<Modal bind:dialog={dialog} bind:showModal isSearch={true}>
	{#if search === 'ready'}
		<div class="search">
			<input
				bind:value={searchTerm}
				placeholder="Cerca..."
				autocomplete="off"
				spellcheck="false"
				type="search"
			/>

			<div class="results">
				{#if results}
					<ul>
						{#each results as result (result.slug)}
							<div
								on:click={() => {
									goto("/" + result.slug);
									showModal = false;
									searchTerm = '';
									dialog.close();
								}}
								class="link"
								transition:fade={{
									duration: 20
								}}
							>
								<h3>
									{@html result.title}
								</h3>
								<p>{@html result.content}</p>
							</div>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/if}
</Modal>

<style>
	.search {
		padding: 1em;
	}

	.search-icon{
		transform: translateY(0);
	}

	@media (min-width: 1300px) {
		.search-icon{
			transform: translateY(-10px);
		}
	}

	button {
		background-color: var(--automataBlackO);
		color: var(--automataWhite);
		border: none;
		padding: 0.5em;
		cursor: pointer;
		border-radius: 100%;
	}

	input {
		width: 100%;
		padding: 0.5em;
		font-size: 1em;
		background-color: var(--automataBlackO);
		color: var(--automataWhite);
	}

	h3 {
		margin: 0;
		color: var(--automataWhite);
	}

	/* input placeholder */
	::placeholder {
		color: var(--automataWhite);
	}

	.results {
		margin-top: 1em;
	}

	.results ul {
		list-style: none;
		padding: 0;
	}

	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.link {
		cursor: pointer;
		background-color: var(--automataBlackOpacity);
		color: var(--automataWhite);
		padding: 1em;
		transition: background-color 0.3s;
	}

	.link:hover {
		background-color: var(--automataBlackO);
	}

	.results p {
		margin-top: 0.5em;
	}
</style>
```

Io ho lasciato lo **style** che ho per il mio componente, che non andrà bene per voi, poiché all'interno utilizzo anche un **Modal** per andare a fare la ricerca senza invadere la pagina. Quello che è importante è la **logica** del motore di ricerca.

La logica del componente è molto semplice:
1. Quando il componente è montato, prendiamo i post dal nostro endpoint e creiamo l'indice di ricerca.
2. Quando il componente è pronto, cerchiamo all'interno dell'indice in base alla nostra ricerca.
3. Mostriamo i risultati.

## Conclusioni

Nel suo articolo [Joy Of Code](https://joyofcode.xyz/) aggiunge anche una parte utilizzando un **Web Worker** per aumentare le performance del motore di ricerca, ma io non l'ho implementata poiché non ho avuto problemi di performance. Se avete problemi di performance, vi consiglio di dare un'occhiata al suo articolo perché quì per ora non troverete nulla a riguardo. 

Potrebbero anche esserci situazioni inadeguate in cui anche con 1 sola lettera, il motore di ricerca vi ritorna risultati, ma questo è dovuto al fatto che io ho voluto fare una ricerca parziale e non esatta. Se volete fare una ricerca esatta, potete cambiare il parametro `tokenize` all'interno del file `search.ts` da `forward` a `strict` come detto in precedenza.

![Risultati ricerca](https://i.imgur.com/Pgfiqwi.png)
<center>Risultati della ricerca un po' esagerati</center>

Attualmente non penso che il motore sia ottimale, perché io non ho ancora implementato la ricerca per i tag e neanche per contenuto all'interno dei post, perché non ho ancora rimodellato alcune parti dei dati per essere accessibili senza troppi magheggi. In futuro chissà, magari lo implementerò ma sicuramente non è ora il momento.


