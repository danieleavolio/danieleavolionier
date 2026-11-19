# Traduzione automatica dei contenuti

Servizio di machine translation locale (modello `Helsinki-NLP/opus-mt-it-en`, non un LLM).
Ogni testo viene tradotto **una sola volta**: il risultato è salvato in `translation-cache.json`
e le richieste successive vengono servite dalla cache.

## Avvio

```bash
cd translator
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn service:app --host 0.0.0.0 --port 8080
```

Poi imposta `TRANSLATOR_URL=http://localhost:8080` nel sito SvelteKit.

## Nota Vercel

Le funzioni serverless di Vercel non possono ospitare il modello (dimensioni e freddo).
Questo servizio va deployato separatamente (Railway, Render, VPS o Docker). Senza
`TRANSLATOR_URL`, il sito resta perfettamente funzionante e i contenuti restano in italiano,
mentre l'interfaccia usa il dizionario IT/EN integrato.
