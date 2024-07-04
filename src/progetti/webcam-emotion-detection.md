---
title: Webcam Emotion Detection
description: Piccolo progettod di Machine Learning per rilevare le emozioni umane tramite la webcam, lightweigth e facile da usare.
date: "07-04-2024-16:00"
categories: 
    - Machine Learning
    - Computer Vision
    - Python
    - OpenCV
    - TensorFlow
published: true
---
# Sistema di Rilevamento delle Emozioni

Questo progetto è progettato per rilevare e analizzare le emozioni dai flussi video in tempo reale. Utilizza un **pretrained** per identificare i volti umani e **FER** per classificare le loro emozioni in diverse categorie come *neutro, felice, triste, sorpresa, paura, disgusto e arrabbiato*. Il sistema traccia anche l'andamento delle emozioni dominanti nel tempo, fornendo preziose informazioni sulle dinamiche emotive.

## Caratteristiche

- Rilevamento delle emozioni in tempo reale dai flussi video.
- Identificazione di emozioni multiple.
- Analisi dell'andamento delle emozioni dominanti nel tempo.
- Leggero ed efficiente, adatto per essere eseguito su varie piattaforme hardware.

## Esempio

### Esempio di Rilevamento delle Emozioni

![Esempio di Emozioni](https://i.imgur.com/iImMGgz.png)

![Esempio di Emozioni](https://i.imgur.com/el8560V.png)

## Installazione

Controllare la repository *github* per clonare il progetto e installare le dipendenze necessarie. Tutte le informazioni sono disponibili nel file `requirements.txt`.


## Utilizzo

Per avviare il sistema di rilevamento delle emozioni, esegui lo script principale dal terminale.

### Parametri

- `--analyze_video`: Dopo aver premuto `q` per interrompere il flusso video, verrà salvato un file PNG con l'andamento delle emozioni nel tempo.

## Complicazioni e Limitazioni

Attualmente il progetto funziona solamente con 1 volto alla volta e non è in grado di rilevare emozioni da volti parzialmente visibili o coperti. Inoltre, la precisione del rilevamento delle emozioni può variare in base alla qualità dell'immagine e alla luce ambientale. Il modello è molto molto leggero appunto per funzionare in tempo reale, quindi non è il più accurato in assoluto; piuttosto è un buon compromesso tra accuratezza e velocità. 

Posso dire che in condizioni di scarsa luce si comporta comunque in modo accettabile e con una webcam abbastanza di scarsa qualità, quindi è un buon compromesso per un uso generale. 

## Future implementazioni

- Migliorare la precisione del rilevamento delle emozioni.
- Supporto per il rilevamento di più volti contemporaneamente.
- Possibilità di usare un file video come input.
- Possibilità d i usare un'immagine come input.

## Conclusione

Puoi trovare il progetto sulla pagina **github** qui [Webcam Emotion Detection](https://github.com/danieleavolio/WebcamEmotionDetection)! 

Per qualsiasi domanda o suggerimento, non esitare a contattarmi!
