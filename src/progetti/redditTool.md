---
title: Reddit Post Analyzer
description: Un piccolo tool “plug-and-play” per ricercare post Reddit e prepararli a qualunque analisi di data-science. Ancora un po’ buggato, ma già utile!
date: '01-23-2025-12:00'
categories:
  - Python
  - Streamlit
  - Data Analysis
published: true
---

# Reddit Post Analyzer

**Reddit Post Analyzer** è una web-app scritta in Python che ti aiuta a **raccogliere rapidamente post da Reddit** per poi passarli al tuo workflow di analisi (topic modeling, LLM, dashboard esterne, ecc.).

L’obiettivo è offrirti un’esperienza **plug-and-play**: scarichi il repo, lanci `streamlit run app.py` e sei subito operativo.  
È ancora **un po’ buggato** ✨ (l’UI può bloccarsi se fai tante query di fila), ma fa già il suo dovere.

---

## Perché potrebbe servirti 🧐

1. **Ricerca accademica** – devi studiare il sentiment su un argomento di nicchia? Otterrai in pochi minuti un CSV pulito.
2. **Monitoraggio brand/prodotto** – estrai i post, poi caricali nel tuo sistema di BI.
3. **Prototipazione veloce** – vuoi testare un nuovo modello NLP? Evita di scrivere da zero lo scraper.

---

## Limitazioni da conoscere ⚠️

| Limite                  | Dettagli                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| **Bug noti**            | Refresh ripetuti in Streamlit possono duplicare i log; alcune eccezioni sulla rete non sono gestite.     |
| **Rate limit Reddit**   | Reddit consente ±60 richieste/min. L’app si ferma se superi la quota giornaliera.                        |
| **Solo una chiave API** | Al momento non gestisco client multipli; se più utenti usano la stessa app bisogna condividere la quota. |

---

## Come funziona (in breve)

1. Inserisci **query** + **numero di post**.
2. Lo script chiama la **Reddit API**, poi salva tutto in **SQLite**.
3. Puoi esportare il dataset o visualizzarlo con i grafici incorporati.

---

## Setup rapido 🛠️

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

In meno di 5 minuti hai la dashboard pronta a girare su `localhost:8501`.

---

## Roadmap

- [ ] Gestione completa degli errori di rete ↻
- [ ] Scheduler asincrono per scraping periodico 🕒
- [ ] Supporto PostgreSQL per dataset grandi 🐘
- [ ] Tema dark & layout responsive migliore 🌙

---

— **Daniele Avolio**
