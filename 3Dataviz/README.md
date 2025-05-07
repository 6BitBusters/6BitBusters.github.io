# MVP
[![Check frontend code](https://github.com/6BitBusters/6BitBusters.github.io/actions/workflows/pr_frontend_check.yml/badge.svg)](https://github.com/6BitBusters/6BitBusters.github.io/actions/workflows/pr_frontend_check.yml)
[![Check backend code](https://github.com/6BitBusters/6BitBusters.github.io/actions/workflows/pr_backend_check.yml/badge.svg)](https://github.com/6BitBusters/6BitBusters.github.io/actions/workflows/pr_backend_check.yml)
[![Playwright Tests](https://github.com/6BitBusters/6BitBusters.github.io/actions/workflows/playwright.yml/badge.svg)](https://github.com/6BitBusters/6BitBusters.github.io/actions/workflows/playwright.yml)
[![codecov](https://codecov.io/gh/6BitBusters/6BitBusters.github.io/branch/code%2F3Dataviz/graph/badge.svg?token=DLNTJL4E40)](https://codecov.io/gh/6BitBusters/6BitBusters.github.io)

## Struttura del Progetto

- **backend/**: Contiene il codice del backend scritto in Typescript utilizzando NestJS.
- **frontend/**: Contiene il codice del frontend scritto in Typescript utilizzando React e Redux-Toolkit.
- **dc-dev.yml**: Configurazione di Docker per eseguire l'intero progetto in contenitori in modalita di sviluppo.
- **dc-dep.yml**: Configurazione di Docker per eseguire l'intero progetto in contenitori per il deploy.

**Attenzione**:
I contenitori in modalitá di sviluppo contengono solamente il backend e memcached, il frontend dovrá essere avviato tramite il comando 
```bash
npm run dev
```


## Requisiti

Per il corretto funzionamento, è necessario avere installato:

- [Docker](https://www.docker.com/products/docker-desktop) (con Docker Compose)
- [Node.js](https://nodejs.org/) (per eseguire il frontend in locale, se desiderato)

## Setup

### 1. Clona il Repository

Clona il progetto sulla tua macchina locale:

```bash
git clone git@github.com:6BitBusters/6BitBusters.github.io.git
cd 3Dataviz 
```

## Configura Docker

Il progetto è configurato per essere eseguito tramite Docker Compose, che crea un ambiente di sviluppo completo con:
- Memcached per il per utillzare un sistema di cache dei dati veloce.
- Backend (NestJS) per l'API.
- Frontend (REACT) per l'interfaccia utente.

## File .env

Creare un file .env partendo dall'esempio all`interno della cartella backend:
```bash
cd backend
cp .your.env .env
```
Andare ad assegnare le relative key alle variabili.

## Costruisci e Avvia i Contenitori

Nel terminale, all`interno della cartella 3Dataviz, esegui il seguente comando per costruire e avviare tutti i contenitori:

```bash
docker-compose -f "[file.yaml]" down -v 
docker-compose -f "[file.yaml]" up --build
```

Se le immagini sono state giá create e si vuole solamente farle partire basta eseguire il seguente comando

```bash
docker-compose -f "[file.yaml]" up
```

## Accesso all'Applicazione
- Frontend: Dopo aver eseguito il comando precedente, puoi accedere al frontend all'indirizzo: http://localhost:4173.
- Backend: Il backend sarà accessibile su http://localhost:3000.