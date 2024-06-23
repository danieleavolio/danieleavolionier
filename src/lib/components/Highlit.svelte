<script lang='ts'>

    export let type: string;

    // based on the type, we can change the color of the highlight
    let color = 'yellow';

    if (type === 'warning') {
        color = 'red';
    } else if (type === 'info') {
        color = 'yellow';
    }
    else if (type === 'important') {
        color = 'black';
    }



    // we can also add a class to the component
    let classes = `highlit highlit-${color}`;

</script>


<div class={classes}>
    <slot></slot>
</div>

<style>
    .highlit {
        padding: 1rem;
        border-radius: 0.5rem;

    }

    .highlit-yellow {
        background-color: var(--automataYellow)
    }

    .highlit-red {
        background-color: var(--automataRed);
    }

    .highlit-black {
        background-color: var(--automataBlack0);
    }

    .highlit-green {
        background-color: green;
    }

</style>