<script>

    export let href = "";
    // Redirec creating a new window
    const onClickRedirect = () => {
        window.open(href, "_blank");
    }
    

</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<p on:click={onClickRedirect} class="link-normale">
    <slot></slot>
</p>

<style>
    .link-normale {
        display: inline;
        margin: 0;
        padding: 0.2em;
        cursor: pointer;
        color: var(--text-1-dark);
        text-decoration: none;
        transition: color 0.15s ease, border-color 0.15s ease;
        width: fit-content;
        transition: all 0.5s ease;
    }

    .link-normale:hover {
        background-color: var(--automataBgRGBA)
    }

</style>