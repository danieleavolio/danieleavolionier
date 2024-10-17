<!-- Component dove ci sono linkedin twitter e github -->

<script lang="ts">

    let contacts = [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/danieleavolio/',
            icon: 'linkedin'
        },
        {
            name: 'x',
            url: 'https://twitter.com/avolio_daniele',
            icon: 'x'
        },
        {
            name: 'GitHub',
            url: 'https://github.com/danieleavolio',
            icon: 'github'
        }
    ];


    const handleClick = (url:string) => {
        window.open(url, '_blank');
    }

</script>


<div class="contacts">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#each contacts as contact}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img src={`https://simpleicons.org/icons/${contact.icon}.svg`} alt={contact.name} class="icon" on:click={() => handleClick(contact.url)} />
    {/each}
</div>

<style>
    .icon {
        width: 24px;
        height: 24px;
        transition: transform 0.2s;
    }

    .icon:hover {
        cursor: pointer;
        transform: scale(1.1);
    }

    .contacts {
        max-width: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }

</style>
