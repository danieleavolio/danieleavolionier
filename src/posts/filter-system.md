---
title: Implementazione di un Sistema di Filtri
description: Come ho implementato un sistema di filtri per il mio blog
date: "09-05-2023-14:30"
categories: 
    - programmazione
    - web
    - blog
published: true
---

# L'idea

Al momento il numero di **post** è molto basso, ma in futuro (forse) il numero crescerà e sarà difficile trovare un post. Quindi ho deciso di implementare un **sistema di filtri**. L'idea è abbastanza semplice, perché lo sto facendo in Javascript e **NON** utilizzando un **sistema API**. Comunque, iniziamo.

## Il risultato

Il risultato finale che volevo ottenere era un semplice **dialogo** in cui poter selezionare un tag preso dai **post** e quindi mostrare i **post** con quel tag. Quindi, ho iniziato a pensare a come farlo senza cambiare molto la **UI di NieR Automata**.

![Sistema di Filtri](https://i.imgur.com/Uw65SzN.gif)

Passiamo al codice.

## Il codice

**CSS**
```css
<style>
	.filter-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em;
		cursor: pointer;
	}
	p {
		display: flex;
		align-items: center;
		gap: 0.2em;
		padding: 0.19em;
		cursor: pointer;
	}

	.filters {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--automataBg);
		padding: 1em;
		border-top: 2px solid var(--automataBlackOpacity);
		border-bottom: 2px solid var(--automataBlackOpacity);
		max-height: 300px;
		height: 0;
		min-width: 300px;
		overflow: scroll;
		opacity: 0;
		transition: all 0.3s ease-in-out;
	}

	.filter-item {
		color: var(--automataColor);
		text-transform: uppercase;
		position: relative;
		z-index: 2;
	}

	.filter-item::before {
		content: '';
		background-color: var(--automataColor);
		width: 100%;
		position: absolute;
		left: 0;
		height: 100%;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease-in-out;
		z-index: -1;
		cursor: pointer;
	}

	.filter-item:hover::before {
		transform: scaleX(1);
	}

	.filter-item:hover {
		color: var(--automataBg) !important;
		transition: 0.2s ease-in-out;
	}

	.backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		background-color: var(--automataColor);
		opacity: 0;
	}

	::-webkit-scrollbar-corner {
		background-color: var(--automataBg);
	}

	::-webkit-scrollbar {
		width: 0.5em;
	}

	.clear {
		background-color: var(--automataRedOpacity);
		font-size: 1.2em;
		padding: 0.5em;
		color: var(--automataColor);
		text-align: center;
		cursor: pointer;
		justify-content: center;
	}

	.clear:hover {
		background-color: var(--automataRed);
		transition: 0.2s ease-in-out;
	}
</style>
```

**Svelte**
```typescript
<section>
	<div class="filter-title" on:click={() => handleClick()} id="1">
		<h3>FILTRI</h3>
		{#if isShowing}
			<ChevronsDownUp cursor="pointer" />
		{:else}
			<ChevronsUpDown cursor="pointer" />
		{/if}
	</div>
	<div bind:this={filters} class="filters">
		{#each categories as category, i}
			<div on:click={() => setActive(i)}>
				<p class="filter-item" id="-{i}">
					<span class="backdrop" /><Cpu />{category}
				</p>
			</div>
		{/each}
	</div>
	{#if activeFilters.length > 0}
		<p on:click={() => clearFilters()} transition:fly class="clear">CLEAR</p>
	{/if}
</section>
```

Le funzioni principali sono gestite nel div **filter-title**, il cui script verrà mostrato di seguito.

Poi, per ogni categoria nella lista, la **stringa** viene aggiunta a un array chiamato **activeFilters**. Questo array viene utilizzato per filtrare i post inviandolo con un **eventDispatcher** al componente che gestisce il **materiale del blog**.

**Typescript**
```typescript
<script>
	import { ChevronsDownUp, ChevronsUpDown, Cpu } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let categories: string[] = [];

	let activeFilters: string[] = [];
	let isShowing = false;
	let filters: HTMLElement;
	const dispatch = createEventDispatcher();

	const handleClick = () => {
		isShowing = !isShowing;

		if (isShowing) {
			filters.style.setProperty('height', '300px');
			filters.style.setProperty('width', '100%');
			filters.style.setProperty('opacity', '1');
		} else {
			filters.style.setProperty('height', '0');
			filters.style.setProperty('opacity', '0');
		}
	};

	const clearFilters = () => {
		activeFilters = [];

		let items = document.querySelectorAll('.filter-item');
		items.forEach((item: any) => {
			item.firstChild?.style.setProperty('opacity', '0');
			item.style.setProperty('color', 'var(--automataColor)');
		});
		dispatch('filter', activeFilters);
	};
	const setActive = (i: number) => {
		let target: any = document.getElementById(`-${i}`);
		console.log(target?.textContent);

		let filter = target?.textContent;
		if (activeFilters.includes(filter!)) {
			activeFilters = activeFilters.filter((item) => item !== filter);
			// target the first child and set the style
			target?.firstChild?.style.setProperty('opacity', '0');
			target.style.setProperty('color', 'var(--automataColor)');
		} else {
			activeFilters = [...activeFilters, filter!];
			// target the first child and set the style
			target?.firstChild?.style.setProperty('opacity', '1');
			target.style.setProperty('color', 'var(--automataBg)');
		}

		dispatch('filter', activeFilters);
	};
</script>
```

Avrei potuto gestire il **CSS** utilizzando il **riferimento** all'**HTMLElement**, ma ero un po' pigro e non volevo farlo. Quindi, ho utilizzato la proprietà **style** per impostare i selettori **CSS**.

Non c'è molto altro da dire, il codice si spiega praticamente da solo. Puoi copiare e utilizzare questo codice nei tuoi progetti, ma apprezzerei se potessi darmi qualche credito 🙏.

## Conclusione

Sono abbastanza soddisfatto del risultato, è semplice e funziona. Non sono sicuro se lo aggiornerò in futuro, ma probabilmente lo farò. Spero che questo post ti sia piaciuto e ci vediamo nel prossimo!



