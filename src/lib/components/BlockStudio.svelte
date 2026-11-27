<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	/**
	 * Cornice comune degli studi dei blocchi: dialogo modale, colonna dei
	 * controlli, anteprima dal vivo e pulsanti Annulla/Inserisci.
	 * Lo studio fornisce `controls` e `preview` e decide quando `valid`.
	 */
	let {
		title,
		previewLabel = 'Anteprima',
		submitLabel,
		valid,
		submit,
		dismiss,
		controls,
		preview
	}: {
		title: string;
		previewLabel?: string;
		submitLabel: string;
		valid: boolean;
		/** Chiamata con il blocco valido: lo studio passa il sorgente a `apply`. */
		submit: () => void;
		dismiss: () => void;
		controls: Snippet;
		preview: Snippet;
	} = $props();

	const id = $props.id();
	let dialog: HTMLDialogElement;

	onMount(() => dialog.showModal());

	function commit() {
		if (!valid) return;
		submit();
		dialog.close();
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby={`${id}-heading`}
	onclose={dismiss}
	onkeydown={(event) => event.stopPropagation()}
>
	<header class="studio-header">
		<h2 id={`${id}-heading`}>{title}</h2>
		<button type="button" onclick={() => dialog.close()}>Annulla</button>
	</header>

	<div class="studio-grid">
		<div class="controls">{@render controls()}</div>
		<section class="studio-preview" aria-label={previewLabel}>
			<h3>{previewLabel} in tempo reale</h3>
			{@render preview()}
		</section>
	</div>

	<footer>
		<button class="primary" type="button" disabled={!valid} onclick={commit}>{submitLabel}</button>
	</footer>
</dialog>

<style>
	dialog {
		box-sizing: border-box;
		inline-size: min(68rem, calc(100vw - 1.5rem));
		max-block-size: calc(100dvh - 1.5rem);
		margin: auto;
		padding: clamp(0.75rem, 2.5vw, 1.5rem);
		border: 1px solid var(--automataColor);
		border-radius: 0;
		color: var(--automataColor);
		background: var(--automataBg);
	}

	dialog::backdrop {
		background: rgb(21 21 18 / 65%);
	}

	.studio-header,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.65rem;
	}

	footer {
		justify-content: end;
	}

	.studio-header h2,
	.studio-preview h3 {
		margin: 0;
		font-family: var(--font-mono);
	}

	.studio-grid {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
		gap: 1rem;
		margin-block: 1rem;
	}

	.controls {
		display: grid;
		align-content: start;
		gap: 0.5rem;
		min-inline-size: 0;
	}

	/* Campi dei controlli: gli studi li scrivono nel loro snippet. */
	.controls :global(label) {
		display: grid;
		gap: 0.5rem;
		min-inline-size: 0;
		font-weight: 600;
	}

	.controls :global(input),
	.controls :global(select),
	.controls :global(textarea) {
		box-sizing: border-box;
		inline-size: 100%;
		min-inline-size: 0;
		padding: 0.4rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		color: inherit;
		background: var(--automataBg);
		font: inherit;
	}

	.controls :global(input[type='checkbox']) {
		inline-size: auto;
	}

	.controls :global(p) {
		margin: 0;
		font-size: 0.9rem;
	}

	.studio-preview {
		position: sticky;
		inset-block-start: 0;
		align-self: start;
		min-inline-size: 0;
		padding: 0.75rem;
		border: 1px solid var(--yr-line-strong);
	}

	.studio-preview h3 {
		margin-block-end: 0.75rem;
		font-size: 1rem;
	}

	button,
	.controls :global(button) {
		padding: 0.35rem 0.65rem;
		border: 1px solid var(--yr-line-strong);
		border-radius: 0;
		box-shadow: none;
		color: inherit;
		background: var(--automataBg);
	}

	.primary {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.primary:disabled {
		opacity: 0.5;
	}

	@media (max-width: 740px) {
		.studio-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.studio-preview {
			position: static;
		}
	}
</style>
