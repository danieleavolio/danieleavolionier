<svelte:head>
	<title>Privacy Policy | Astra</title>
	<meta
		name="description"
		content="Informativa sulla privacy dell'app Android Astra. Nessuna raccolta dati personale e dati salvati esclusivamente sul dispositivo."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<svelte:options immutable={true} />

<article class="privacy-page">
	<header class="privacy-header">
		<p class="eyebrow">ASTRA · APP ANDROID</p>
		<h1>Privacy Policy</h1>
		<p class="intro">
			Questa informativa descrive come l'app Astra gestisce i dati degli utenti. Astra è progettata
			per funzionare nel rispetto della privacy: i dati generati dall'app restano sul dispositivo
			dell'utente.
		</p>
		<p class="updated">Ultimo aggiornamento: 7 settembre 2026</p>
	</header>

	<section aria-labelledby="titolare">
		<h2 id="titolare">1. Titolare del trattamento</h2>
		<p>
			Il titolare dell'app Astra è <strong>Daniele Avolio</strong>. Per richieste relative alla privacy
			o all'utilizzo dell'app è possibile contattare il titolare tramite il
			<a href="https://github.com/danieleavolio" rel="noreferrer">profilo GitHub pubblico</a>.
		</p>
	</section>

	<section aria-labelledby="nessuna-raccolta">
		<h2 id="nessuna-raccolta">2. Nessuna raccolta o condivisione di dati personali</h2>
		<p>
			<strong>Astra non raccoglie dati personali, non li salva su server esterni e non li condivide
			con terze parti.</strong>
		</p>
		<p>
			Le statistiche, i conteggi, le preferenze e gli eventuali log generati dall'app vengono salvati
			esclusivamente in locale sul telefono dell'utente. Il titolare non può accedere a questi dati,
			non li riceve e non li utilizza per identificare l'utente.
		</p>
		<p>
			La disinstallazione dell'app o la cancellazione dei suoi dati tramite le impostazioni Android
			può rimuovere le informazioni memorizzate localmente.
		</p>
	</section>

	<section aria-labelledby="accessibility-service">
		<h2 id="accessibility-service">3. Utilizzo dell'AccessibilityService</h2>
		<p>
			Astra utilizza l'API Android <strong>AccessibilityService</strong> esclusivamente per rilevare
			quando viene aperta un'app che l'utente ha scelto personalmente di monitorare. A questo scopo,
			il servizio intercetta gli eventi Android di cambio finestra e registra solo l'informazione
			necessaria a determinare quale app monitorata è stata aperta.
		</p>
		<p><strong>L'AccessibilityService di Astra:</strong></p>
		<ul>
			<li>non accede al contenuto dello schermo;</li>
			<li>non registra né intercetta i tap o altri gesti;</li>
			<li>non legge i testi visualizzati o digitati;</li>
			<li>non registra password, messaggi, contenuti multimediali o dati inseriti dall'utente;</li>
			<li>non invia dati a server esterni.</li>
		</ul>
		<p>
			L'accesso al servizio è attivato e gestito dall'utente nelle impostazioni di Android. L'utente
			può disattivarlo in qualsiasi momento; in tal caso la funzione di monitoraggio delle app non
			potrà operare.
		</p>
	</section>

	<section aria-labelledby="acquisti">
		<h2 id="acquisti">4. Acquisti in-app</h2>
		<p>
			Astra offre acquisti in-app sotto forma di <strong>Pass consumabili</strong>. I pagamenti sono
			processati in totale sicurezza tramite il servizio <strong>Google Play Billing</strong>.
		</p>
		<p>
			Astra e il titolare non hanno accesso ai dati finanziari, ai numeri delle carte di credito o
			agli altri dati completi del metodo di pagamento dell'utente. Le informazioni relative al
			pagamento sono gestite da Google secondo i suoi
			<a href="https://policies.google.com/privacy" rel="noreferrer">termini e la sua informativa sulla privacy</a>.
		</p>
	</section>

	<section aria-labelledby="minori">
		<h2 id="minori">5. Minori</h2>
		<p>
			Astra non raccoglie consapevolmente dati personali di minori né richiede la creazione di un
			account. Gli acquisti in-app sono soggetti alle impostazioni e alle autorizzazioni dell'account
			Google Play utilizzato sul dispositivo.
		</p>
	</section>

	<section aria-labelledby="modifiche">
		<h2 id="modifiche">6. Modifiche a questa informativa</h2>
		<p>
			Questa Privacy Policy può essere aggiornata quando necessario, ad esempio in caso di modifiche
			all'app o alle funzionalità del sistema operativo Android. La versione aggiornata sarà pubblicata
			in questa pagina con la relativa data di aggiornamento.
		</p>
	</section>

	<section aria-labelledby="contatti">
		<h2 id="contatti">7. Contatti</h2>
		<p>
			Per domande o richieste riguardanti questa informativa, l'app Astra o i dati memorizzati sul
			dispositivo, è possibile contattare il titolare tramite il
			<a href="https://github.com/danieleavolio" rel="noreferrer">profilo GitHub di Daniele Avolio</a>.
		</p>
	</section>
</article>

<style>
	.privacy-page {
		max-inline-size: 920px;
		margin-inline: auto;
		padding: clamp(1rem, 3vw, 3rem);
		background: color-mix(in srgb, var(--automataWhiteOpacity) 68%, transparent);
		border: 1px solid var(--automataBgRGBA);
		box-shadow: 8px 8px 0 var(--automataBgRGBA);
	}

	.privacy-header {
		padding-bottom: var(--size-5);
		border-bottom: 1px solid var(--automataBgRGBA);
	}

	.eyebrow,
	.updated {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		letter-spacing: 0.12rem;
		text-transform: uppercase;
	}

	.eyebrow {
		margin: 0;
		opacity: 0.72;
	}

	.updated {
		margin-top: var(--size-5);
		opacity: 0.7;
	}

	.intro {
		font-size: clamp(1rem, 2vw, 1.2rem);
		line-height: 1.8;
		max-inline-size: 70ch;
	}

	section {
		margin-top: var(--size-7);
	}

	h2 {
		text-align: left;
		font-size: clamp(1.15rem, 2vw, 1.65rem);
		letter-spacing: 0.12rem;
		text-transform: none;
	}

	p,
	li {
		line-height: 1.85;
	}

	ul {
		list-style: disc;
		padding-inline-start: 1.5rem;
	}

	li {
		padding: 0;
		margin: 0 0 0.6rem;
		background: none;
	}

	a {
		text-transform: none;
		letter-spacing: normal;
		padding: 0;
		background: transparent;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	strong {
		font-weight: 700;
	}

	@media (max-width: 600px) {
		.privacy-page {
			padding: 1rem;
			box-shadow: 4px 4px 0 var(--automataBgRGBA);
		}

		p,
		li {
			line-height: 1.7;
		}
	}
</style>
