# WMC Sommersemesterprojekt – Chess Multiplayer

**Personen:**
Felix Zannantoni
Sebastian Schwingenschuh
Victor Ehrenmüller-Jensen

## Ziel

Ein Schach-Multiplayer-Spiel mit Socket.IO und eigener Oberfläche.

## Projektstruktur

```
chess-multiplayer/
├── .idea/ – Projektdateien von der IDE (z. B. WebStorm, IntelliJ)
├── Chess-website/ – Hauptverzeichnis der Website
│   ├── node_modules/ – Abhängigkeiten (automatisch von npm installiert)
│   ├── Pictures/ – Bilder (vermutlich für die Website)
│   ├── style/ – CSS-Dateien für verschiedene Seiten
│   │   ├── game.css
│   │   ├── general.css
│   │   ├── index.css
│   │   ├── legends.css
│   │   └── rules.css
│   ├── contacts.html – Kontaktseite
│   ├── devteam.html – Teamseite
│   ├── game.html – Spieloberfläche (Frontend)
│   ├── index.html – Startseite
│   ├── legends.html – Legenden-Übersicht
│   ├── rules.html – Schachregeln
│   ├── game.js – Spiellogik (Einzelspieler / bald Multiplayer)
│   ├── general.js – Allgemeine JS-Funktionen
│   ├── index.js – JS für Startseite
│   ├── legends.js – JS für Legenden-Seite
│   ├── rules.js – JS für Regeln-Seite
│   ├── server.js – Node.js + Socket.IO Server
│   ├── translations.js – Mehrsprachigkeit oder Textverwaltung
│   ├── package.json – Projekt-Metadaten & npm-Abhängigkeiten
│   ├── package-lock.json – Abhängigkeitsbaum (automatisch generiert)
│   └── tsconfig.json – TypeScript-Konfiguration (falls verwendet)
├── External Libraries/ – IDE-spezifisch, z. B. Referenzen zu lib-Dateien
└── Scratches and Consoles/ – Temporäre Dateien und Tests in der IDE
```

## How To Start

In `Chess-website/` das Projekt mit `node server.js` starten.
Danach im Browser `game.html` öffnen – zwei Tabs oder zwei Browserfenster verbinden sich automatisch und ermöglichen das Spielen gegeneinander.

## How to push/pull successfully (so far)

**Push (vom Entwicklungsrechner):**

`git add .`

`git commit -m "Neuer Commit"`

`git push`

Änderungen am Code committen und auf den Remote-Branch `main` pushen

**Pull (auf dem Raspberry Pi):**

`cd ~/chess-multiplayer/Chess-website`

`git pull`

Wechselt ins Projektverzeichnis und zieht den neuesten Stand vom Remote-Repository

**Falls `chess-server.service` angepasst werden muss:**

`sudo nano /etc/systemd/system/chess-server.service`

`sudo systemctl daemon-reload`

systemd-Servicedatei bearbeiten und danach neu einlesen lassen

**Services neu starten:**

`sudo systemctl restart chess-server`

`sudo systemctl restart ngrok`

Startet `chess-server` und `ngrok` neu, um neue Änderungen zu übernehmen

**Status prüfen (optional):**

`sudo systemctl status chess-server`

`sudo systemctl status ngrok`

Zeigt den aktuellen Status der beiden Services

**Öffentliche ngrok-Adresse abrufen, da man eine neue beim Neustart von ngrok bekommt:**

`curl http://localhost:4040/api/tunnels`

Gibt die aktuelle öffentliche URL von ngrok aus
