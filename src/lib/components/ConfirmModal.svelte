<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let open = false;
	export let title = 'Conferma eliminazione';
	export let itemName = '';
	export let message = 'Questa operazione è definitiva e rimuoverà il contenuto dal database.';
	export let confirmText = 'Elimina';
	export let cancelText = 'Annulla';

	const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();

	function handleKeyDown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			dispatch('cancel');
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="modal-backdrop"
		transition:fade={{ duration: 150 }}
		on:click|self={() => dispatch('cancel')}
		role="presentation"
	>
		<div
			class="modal-box"
			transition:scale={{ start: 0.96, duration: 150 }}
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-modal-title"
		>
			<div class="modal-header">
				<span class="warning-tag">ATTENZIONE</span>
				<h2 id="confirm-modal-title">{title}</h2>
			</div>

			<div class="modal-body">
				<p class="desc">Sei sicuro di voler eliminare:</p>
				<p class="target-title">"{itemName}"</p>
				<p class="warning-subtext">{message}</p>
			</div>

			<div class="modal-actions">
				<button type="button" class="btn-cancel" on:click={() => dispatch('cancel')}>
					{cancelText}
				</button>
				<button type="button" class="btn-confirm" on:click={() => dispatch('confirm')}>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(46, 45, 39, 0.7);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
		padding: 1rem;
	}

	.modal-box {
		width: 100%;
		max-width: 480px;
		background: var(--automataBg);
		border: 1px solid var(--automataColor);
		box-shadow: 6px 6px 0 rgba(77, 73, 62, 0.5);
		padding: 1.75rem;
		box-sizing: border-box;
		position: relative;
	}

	.modal-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: 1px solid var(--automataColor);
		padding-bottom: 0.75rem;
	}

	.warning-tag {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.15rem;
		color: var(--automataWhite);
		background: var(--automataRed);
		padding: 0.15rem 0.5rem;
		width: fit-content;
	}

	h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: 0.15rem;
		text-transform: uppercase;
		color: var(--automataColor);
	}

	.modal-body {
		padding: 1.25rem 0;
	}

	.desc {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: var(--automataColor);
		opacity: 0.85;
	}

	.target-title {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 700;
		font-family: var(--font-mono);
		color: var(--automataBlack);
		background: var(--automataBgRGBA);
		padding: 0.6rem 0.8rem;
		border-left: 3px solid var(--automataRed);
		word-break: break-word;
	}

	.warning-subtext {
		margin: 0;
		font-size: 0.8rem;
		color: var(--automataRed);
		letter-spacing: 0.05rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		border-top: 1px solid var(--automataColor);
		padding-top: 1rem;
	}

	.btn-cancel,
	.btn-confirm {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		padding: 0.6rem 1.2rem;
		cursor: pointer;
		border-radius: 0;
		box-shadow: none;
		transition: all 0.2s ease-in-out;
	}

	.btn-cancel {
		background: var(--automataBgRGBA);
		color: var(--automataColor);
		border: 1px solid var(--automataColor);
	}

	.btn-cancel:hover {
		background: var(--automataColor);
		color: var(--automataBg);
	}

	.btn-confirm {
		background: var(--automataRed);
		color: var(--automataWhite);
		border: 1px solid var(--automataRed);
	}

	.btn-confirm:hover {
		background: #b54a32;
		border-color: #b54a32;
	}
</style>
