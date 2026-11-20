---
title: Reddit Post Analyzer: cercare e analizzare post Reddit con Python
description: Reddit Post Analyzer è una web app Python e Streamlit per cercare post Reddit, salvarli in SQLite, esportarli in CSV e prepararli all'analisi del testo.
date: '01-23-2025-12:00'
categories:
  - Python
  - Streamlit
  - Data Analysis
faq:
  - question: Serve una chiave API di Reddit?
    answer: Sì. La app usa una sola chiave API e al momento non gestisce client multipli.
  - question: Posso analizzare il sentiment dei post?
    answer: Sì. Il setup scarica il lessico VADER di NLTK e la dashboard mostra un primo risultato. Per un'analisi più accurata puoi esportare il CSV e lavorarci con il tuo modello.
  - question: Quanti post posso raccogliere?
    answer: Dipende dalla quota API di Reddit. Il limite è circa 60 richieste al minuto, oltre il quale le chiamate vengono fermate.
  - question: Funziona con PostgreSQL?
    answer: No. Il salvataggio ora è solo in SQLite. Il supporto a PostgreSQL per dataset grandi è in roadmap.
published: true
---

# Reddit Post Analyzer

Ho scritto Reddit Post Analyzer per eliminare la parte più noiosa di ogni analisi su Reddit: raccogliere i post. È una web app in Python con interfaccia Streamlit. Scegli una query e il numero di post, e ottieni un dataset pronto per topic modeling, sentiment analysis o una dashboard esterna.

L'obiettivo è partire in cinque minuti. Se ti serve una pipeline strutturata con scheduling e più utenti, probabilmente vuoi uno scraper dedicato.

## Cosa fa

La app chiama la Reddit API, salva i risultati in un database SQLite locale e ti lascia esportare il dataset in CSV. Nella dashboard trovi anche alcuni grafici di base e un primo passaggio di sentiment con VADER, il lessico di NLTK.

Il flusso è breve:

1. Inserisci la query e il numero di post da cercare.
2. Lo script interroga la Reddit API e salva tutto in SQLite.
3. Esporti il CSV, oppure guardi i grafici già dentro la dashboard.

## Quando torna utile

Per uno studio su un argomento di nicchia ti serve prima una lista di post pulita. Qui la ottieni senza scrivere lo scraper da zero. Dopo puoi fare topic modeling, contare le parole chiave o Passare il CSV a un modello.

Per il monitoraggio di un brand il processo è lo stesso: estrai i post, esporti il CSV e caricalo nel tuo sistema di BI. Non c'è alcun vendor locked, il dato resta un file locale.

Se vuoi provare un nuovo modello NLP, il CSV è già nel formato giusto per pandas. Puoi concentrarti sul modello invece che sulla raccolta.

## Setup

Il repository è su GitHub:

```bash
git clone https://github.com/danieleavolio/RedditTool.git
cd RedditTool
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python - <<EOF
import nltk, sys
nltk.download("vader_lexicon"); nltk.download("punkt")
EOF
streamlit run app.py
```

Dopo qualche secondo la dashboard è su `localhost:8501`. Il download di `vader_lexicon` serve solo al primo avvio.

## Limiti da conoscere

La UI può bloccarsi se lanci troppe query di fila. I refresh ripetuti in Streamlit a volte duplicano i log e alcune eccezioni di rete non sono ancora gestite. Se succede, ricarica la pagina e ripeti la query con un numero di post più basso.

Reddit accetta circa 60 richieste al minuto e blocca le chiamate quando superi la quota giornaliera. Per ricerche grandi conviene lavorare a lotti e aspettare tra un blocco e l'altro.

La app usa una sola chiave API. Se più persone la usano, la quota viene condivisa.

## Domande frequenti

### Serve una chiave API di Reddit?

Sì. La app usa una sola chiave API e al momento non gestisce client multipli.

### Posso analizzare il sentiment dei post?

Sì. Il setup scarica il lessico VADER di NLTK e la dashboard mostra un primo risultato. Per un'analisi più accurata puoi esportare il CSV e lavorarci con il tuo modello.

### Quanti post posso raccogliere?

Dipende dalla quota API di Reddit. Il limite è circa 60 richieste al minuto, oltre il quale le chiamate vengono fermate.

### Funziona con PostgreSQL?

No. Il salvataggio ora è solo in SQLite. Il supporto a PostgreSQL per dataset grandi è in roadmap.

## Roadmap

- [ ] Gestione completa degli errori di rete
- [ ] Scheduler asincrono per scraping periodico
- [ ] Supporto PostgreSQL per dataset grandi
- [ ] Tema dark e layout responsive migliore

Daniele Avolio
