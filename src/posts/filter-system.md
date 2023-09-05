---
title: Filter System Implementation
description: How I implemented a filter system for my blog
date: "09-05-2023-14:30"
categories: 
    - programming
    - web
    - blog
published: true
---

# The idea

Right now the number of **posts** are very low, but in the future (maybe) the number will grow and it will be hard to find a post. So I decided to implement a **filter system**. The idea is kind of simple, because I'm doing it in Javascript and **NOT** using an **API system**. So, anyway, let's get started.

## The result

The final result I wanted to achieve was a simple **dialog** in which I could select a tag taken from the **posts** and then the **posts** with that tag would be shown. So, I started to think about how to do it without changing a lot the **NieR Automata UI**.

![Filter System](https://i.imgur.com/Uw65SzN.gif)

Let's go to the code.

## The code
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
		<h3>FILTERS</h3>
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

The main functions are handled in the **filter-title** div, which script will be shown below. 

Then, for each category in the list, the **string** is added to an array called **activeFilters**. This array is used to filter the posts sending it with an **eventDispatcher** to the component that handles the **blog's material**.

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

I could have handled the **css** using the **reference** to the **HTMLElement**, but I was a little bit lazy and I didn't want to do it. So, I used the **style** property to set the **css** selectors.

Not so much to say anymore, the code pretty much explains itself. You can copy and use this code in your projects, but I would appreciate if you could give me some credit 🙏.

## Conclusion

I'm pretty happy with the result, it's simple and it works. I'm not sure if I will update it in the future, but I will probably do it. I hope you enjoyed this post and see you in the next one!



