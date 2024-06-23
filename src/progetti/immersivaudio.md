---
title: Immersivaudio
description: Generazione musicale AI da contenuti video e foto.
date: "06-02-2024-16:00"
categories: 
    - Python
    - PyTorch
    - Gradio
    - AI
published: true
---

## Panoramica del Progetto
Immersivaudio è un progetto innovativo che trasforma contenuti visivi in musica utilizzando la potenza dell'intelligenza artificiale. Estraendo e analizzando fotogrammi dai video, il progetto utilizza tecniche avanzate di AI per generare prompt descrittivi che vengono poi convertiti in musica. Questa fusione tra visione artificiale, elaborazione del linguaggio naturale e generazione musicale crea un'esperienza audio-visiva unica e immersiva.

![Immersivaudio](https://i.imgur.com/A3AmTK6.png)

## Tecnologie Utilizzate
### Python
Il linguaggio di programmazione principale utilizzato per sviluppare i vari script e algoritmi del progetto.

### PyTorch
Utilizzato per costruire e addestrare i modelli di AI, specialmente per il rilevamento di oggetti e la generazione musicale.

### Gradio
Fornisce un'interfaccia facile da usare per eseguire il progetto e interagire con i modelli AI.

## Caratteristiche Principali e Script

### Generazione Musicale
- **audioldm2.py**: Questo script prende prompt descrittivi e genera la musica corrispondente, creando una colonna sonora che riflette il contenuto visivo.

### Analisi dei Fotogrammi
- **best_frame_selection.py**: Implementa un algoritmo di clustering k-medoidi per selezionare i fotogrammi più rappresentativi da un video, garantendo la massima qualità dell'input per ulteriori analisi.
- **frame_extractor.py**: Estrae fotogrammi dai file video utilizzando una formula specifica, preparandoli per il rilevamento di oggetti e la generazione di descrizioni.

### Rilevamento e Descrizione degli Oggetti
- **yolov9.py**: Utilizza il modello YOLOv9 per rilevare oggetti all'interno dei fotogrammi video, fornendo informazioni dettagliate sul contenuto di ogni fotogramma.
- **moondream2.py**: Genera descrizioni testuali dai fotogrammi specifici, traducendo le informazioni visive in un formato adatto per la generazione musicale.

![YoloV9](https://i.imgur.com/3Shji5F.png)

### Integrazione e Interfaccia
- **gradio_interface.py**: Crea un'interfaccia user-friendly con Gradio, permettendo agli utenti di eseguire facilmente il progetto e interagire con i componenti AI.
- **prompt_combiner.py**: Combina i risultati degli script di descrizione dei fotogrammi e rilevamento degli oggetti per generare prompt completi per il processo di generazione musicale.
- **video_reconstructor.py**: Reintegra la musica generata con il video originale, producendo un prodotto finale che armonizza elementi audio e visivi.
- **main.py**: Sovraintende l'intero workflow, assicurando un'operazione fluida dall'input video all'output musicale.

![Interfaccia](https://i.imgur.com/is1SWhV.png)

## Notebook
Diversi notebook Jupyter (.ipynb) accompagnano il progetto, illustrando l'uso degli script e il workflow complessivo di elaborazione video. Anche se questi notebook sono stati rimossi nell'ultimo commit, rimangono accessibili nelle versioni precedenti del repository.

## Istruzioni per l'Uso
### Google Colab
Per gli utenti senza una GPU, Google Colab offre una piattaforma conveniente per eseguire il progetto. Il notebook `Immersiveaudio_Colab.ipynb` fornisce una guida dettagliata per eseguire il progetto nel cloud, sfruttando le risorse di Colab per l'elaborazione AI.

### Macchina Locale
Gli utenti con una GPU ad alte prestazioni e capacità CUDA possono eseguire il progetto localmente. Dopo aver installato le dipendenze necessarie, lo script `gradio_interface.py` può essere eseguito per avviare l'interfaccia Gradio e iniziare il processo di generazione musicale.

Per esplorare il progetto completo e accedere al codice, visita il [repository GitHub](https://github.com/danieleavolio/Immersivaudio).

<h3 align="center">Esempio di Video</h3>

<video style="margin:auto" width="320" height="240" controls>
  <source src="https://i.imgur.com/3kZ3CVA.mp4" type="video/mp4">
    Il tuo browser non supporta il tag video.
</video>

## Conclusione

Ecco tutto. Ho lavorato a questo progetto con altre due persone:
- [Daniele Avolio](https://github.com/danieleavolio)
- [Michele Vitale](https://github.com/maikuvit)
- [Teodor Chakarov](https://github.com/pythonTedo)

È stato un progetto molto interessante e abbiamo imparato molto su AI, generazione musicale e visione artificiale. Ci vediamo nel prossimo progetto! 🚀

---
