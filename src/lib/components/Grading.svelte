<script lang="ts">
	export let grade = 0;
	export let pros: any[] = [];
	export let cons: any[] = [];
    export let title = '';

	$: gradeColor = grade <= 4 ? '#cd674d' : grade <= 7 ? '#ece7d5' : '#e1d8aa';
</script>

<div class="container">
	<div class="grade" style="background-color: {gradeColor};">
		<span>
			{grade}
		</span>
	</div>
	<div class="pros">
		<h3>Pros</h3>
		<ul>
			{#each pros as pro}
				<li>{pro}</li>
			{/each}
		</ul>
	</div>
	<div class="cons">
		<h3>Cons</h3>
		<ul>
			{#each cons as con}
				<li>{con}</li>
			{/each}
		</ul>
	</div>
	<div class="final-comment">
        <h2 style="color: {gradeColor};"
        >{title}</h2>
		<slot />
	</div>
</div>

<style>
    h2{
        font-weight: bold;
        text-align: center;
        margin: 1em;
    }

	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		padding: 1rem;
		border-radius: 8px;
		width: 100%;
	}
	.grade {
		font-size: 4rem;
		font-weight: bold;
		text-align: center;
		grid-column: span 2;
		margin-bottom: 1rem;
		color: var(--automataBlack0);
		margin: auto;
		width: 100px;
		height: 100px;
		border-radius: 100%;
		padding: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.pros,
	.cons {
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--automataBlack);
		color: var(--automataWhite);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		width: 100%;
	}
	.pros h3,
	.cons h3 {
		margin-top: 0;
		font-size: 1.5rem;
		font-weight: bold;
	}
	.pros {
		border-left: 5px solid var(--automataYellow);
	}

	.pros h3 {
		color: var(--automataYellow);
	}

	.pros li::marker {
		color: var(--automataYellow);
	}

	.cons h3 {
		color: var(--automataRed);
	}

	.cons li::marker {
		color: var(--automataRed);
	}

	.cons {
		border-left: 5px solid var(--automataRed);
	}

	.final-comment {
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--automataBlack);
		color: var(--automataWhite);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		grid-column: span 2;
		width: 100%;
	}


    @media (max-width: 900px) {
        .container {
            grid-template-columns: 1fr;
        }
        .grade {
            grid-column: span 1;
        }
        .pros {
            grid-column: span 1;
        }
        .cons {
            grid-column: span 1;
        }
        .final-comment {
            grid-column: span 1;
        }

		.final-comment h2 {
			word-break: break-word;
		}
    }
</style>
