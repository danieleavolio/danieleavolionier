<script>
	export let postTitle = '';
	export let postUrl = '';

	// Funzione per aprire una finestra popup di condivisione su Twitter
	function shareOnTwitter() {
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			postTitle
		)}&url=${encodeURIComponent(postUrl)}`;
		window.open(twitterUrl, '_blank', 'width=500,height=400');
	}

	// Funzione per aprire una finestra popup di condivisione su Reddit
	function shareOnReddit() {
		const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
			postUrl
		)}&title=${encodeURIComponent(postTitle)}`;
		window.open(redditUrl, '_blank', 'width=500,height=400');
	}

	// Funzione per copiare il link del post negli appunti
	function copyLink() {
		navigator.clipboard.writeText(postUrl);
	}
</script>

<!-- HTML per i pulsanti di condivisione -->
<div class="share-buttons">
	<button on:click={shareOnTwitter} class="twitter-share">
		<img src={`https://simpleicons.org/icons/x.svg`} alt="twitter" />Condividi su X</button
	>
	<button on:click={copyLink} class="copy-link"> Copia il link</button>
</div>

<!-- Stili per i pulsanti di condivisione -->
<style>
	.share-buttons {
		display: flex;
		gap: 10px;
        margin: 1em;
        justify-content: center;
	}

    .share-buttons button {
        padding: 10px;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-shadow: none;
        color: var(--automataWhite);
    }

    img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        box-shadow: none;
        }



	.twitter-share {
		background-color: var(--automataBlackOpacity);
	}

	.copy-link {
		background-color: var(--automataRedOpacity);
	}

    .twitter-share:hover,
    .copy-link:hover {
        transform: scale(1.05);
    }

    .twitter-share:hover {
        background-color: var(--automataBlackO);
    }

    .copy-link:hover {
        background-color: var(--automataRed);
    }

</style>
