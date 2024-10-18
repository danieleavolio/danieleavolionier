<script lang="ts">
	import { fade } from 'svelte/transition';

	export let showModal: any; // boolean
	export let isSearch = false; // boolean

	export let dialog:any = 0; // HTMLDialogElement

	$: if (dialog && showModal) {
		dialog.showModal();
		dialog.scrollTop = 0;
	}

	const close = () => {
		showModal = false;
		dialog.close();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog} on:close={close} on:click|self={() => dialog.close()} transition:fade
	class:search={isSearch}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="internal">
		<slot name="header" />
		<slot class="internal" />
		<!-- svelte-ignore a11y-autofocus -->
		<!-- svelte-ignore a11y-invalid-attribute -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<a autofocus on:click={() => dialog.close()}>CHIUDI</a>
	</div>
</dialog>

<style>
	dialog {
		border-radius: 0.2em;
		border: none;
		padding: 2em;
	}

	.search {
		padding: 1em;
		width: 80%;
		min-height: 80%;
		flex-direction: column;
		justify-content: space-evenly;
		transition: all 0.3s;
	}

	.internal {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		height: 100%;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	a {
		display: block;
		margin: auto;
	}
</style>
