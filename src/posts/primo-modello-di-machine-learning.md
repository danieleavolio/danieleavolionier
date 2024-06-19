---
title: Primo Modello di Machine Learning [AI]
description: In questo post, vedremo come creare un semplice modello di predizione del prezzo delle case utilizzando Python e scikit-learn. L'obiettivo è fornire una guida passo-passo per costruire un modello predittivo utilizzando regressione lineare.
date: "06-19-2024-19:30"
categories: 
    - machine-learning
    - python
    - scikit-learn
published: true
---

# Guida alla Creazione di un Modello di Predizione del Prezzo delle Case

In questo post, vedremo come creare un semplice modello di predizione del prezzo delle case utilizzando Python e scikit-learn. L'obiettivo è fornire una guida passo-passo per costruire un modello predittivo utilizzando regressione lineare.

## Passaggi Principali

1. **Importazione delle librerie necessarie**
2. **Caricamento del dataset**
3. **Esplorazione e pulizia dei dati**
4. **Preparazione dei dati per il modello**
5. **Addestramento del modello di regressione lineare**
6. **Valutazione del modello**
7. **Utilizzo del modello per fare predizioni**

## 1. Importazione delle Librerie Necessarie

Iniziamo importando le librerie essenziali per il nostro progetto:

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
```

## 2. Caricamento del Dataset

Per questo esempio, utilizzeremo il famoso dataset "Boston Housing". È possibile caricarlo direttamente da scikit-learn:

```python
from sklearn.datasets import load_boston
boston = load_boston()
df = pd.DataFrame(boston.data, columns=boston.feature_names)
df['PRICE'] = boston.target
```

## 3. Esplorazione e Pulizia dei Dati

Diamo un'occhiata ai primi record del dataset e alle statistiche descrittive:

```python
print(df.head())
print(df.describe())
```

È importante verificare la presenza di valori mancanti e, se presenti, gestirli adeguatamente:

```python
print(df.isnull().sum())
```

## 4. Preparazione dei Dati per il Modello

Selezioniamo le caratteristiche (features) e la variabile target (il prezzo delle case):

```python
X = df.drop('PRICE', axis=1)
y = df['PRICE']
```

Dividiamo i dati in set di addestramento e di test:

```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

## 5. Addestramento del Modello di Regressione Lineare

Creiamo un'istanza del modello di regressione lineare e addestriamolo con i dati di addestramento:

```python
model = LinearRegression()
model.fit(X_train, y_train)
```

## 6. Valutazione del Modello

Utilizziamo i dati di test per valutare le prestazioni del modello:

```python
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse}')
```

Possiamo anche visualizzare i risultati con un grafico:

```python
plt.scatter(y_test, y_pred)
plt.xlabel('True Prices')
plt.ylabel('Predicted Prices')
plt.title('True vs Predicted Prices')
plt.show()
```

## 7. Utilizzo del Modello per Fare Predizioni

Ora possiamo utilizzare il nostro modello per predire i prezzi delle case su nuovi dati:

```python
new_data = [[0.00632, 18.00, 2.31, 0, 0.538, 6.575, 65.2, 4.0900, 1, 296, 15.3, 396.90, 4.98]]  # Esempio di nuovi dati
predicted_price = model.predict(new_data)
print(f'Predicted Price: {predicted_price}')
```

## Conclusione

Abbiamo visto come creare un semplice modello di predizione del prezzo delle case utilizzando regressione lineare. Questo esempio può essere un punto di partenza per modelli più complessi che utilizzano tecniche di machine learning più avanzate.

## Aggiunta finale

Ho provato a generare questo post utilizzando ChatGPT 4o per vedere se effettivamente un post venisse indicizzato e quanto effettivamente sarebe stato trovato nelle ricerche. Chiaramente il contenuto è fittizio e non rappresenta un vero post di machine learning, però comunque da un'idea abbastanza semplice del topic discusso. Vabbè, ciao!
