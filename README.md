# WMC Sommersemesterprojekt – Chess Multiplayer

**Personen:**  
Felix Zannantoni  
Sebastian Schwingenschuh  
Victor Ehrenmüller-Jensen

## Ziel
Ein Schach-Multiplayer-Spiel mit Socket.IO und eigener Oberfläche.

## Projektstruktur

chess-multiplayer/
│
├── .idea/                      # Projektdateien von der IDE (z. B. WebStorm, IntelliJ)
├── Chess-website/              # Hauptverzeichnis der Website
│   ├── node\_modules/           # Abhängigkeiten (automatisch von npm installiert)
│   ├── Pictures/               # Bilder (vermutlich für die Website)
│   ├── style/                  # CSS-Dateien für verschiedene Seiten
│   │   ├── game.css
│   │   ├── general.css
│   │   ├── index.css
│   │   ├── legends.css
│   │   └── rules.css
│   ├── contacts.html           # Kontaktseite
│   ├── devteam.html            # Teamseite
│   ├── game.html               # Spieloberfläche (Frontend)
│   ├── index.html              # Startseite
│   ├── legends.html            # Legenden-Übersicht?
│   ├── rules.html              # Schachregeln
│   ├── game.js                 # Spiellogik (Einzelspieler / bald Multiplayer)
│   ├── general.js              # Allgemeine JS-Funktionen
│   ├── index.js                # JS für Startseite
│   ├── legends.js              # JS für Legenden-Seite
│   ├── rules.js                # JS für Regeln-Seite
│   ├── server.js               # Node.js + Socket.IO Server
│   ├── translations.js         # Mehrsprachigkeit oder Textverwaltung
│   ├── package.json            # Projekt-Metadaten & npm-Abhängigkeiten
│   ├── package-lock.json       # Abhängigkeitsbaum (automatisch generiert)
│   └── tsconfig.json           # TypeScript-Konfiguration (falls verwendet)
│
├── External Libraries/         # (IDE-spezifisch, z. B. Referenzen zu lib-Dateien)
└── Scratches and Consoles/     # (Temporäre Dateien und Tests in der IDE)


## How To Start

1. In das Verzeichnis `Chess-website/` wechseln:
   ```bash
   cd Chess-website
   
2. Server starten:

   ```bash
   node server.js
   ```

3. Im Browser die Spielseite (`game.html`) öffnen:

   * Zwei Tabs oder zwei Browser öffnen
   * Beide Tabs verbinden sich automatisch miteinander
   * Dann können zwei Spieler gegeneinander Schach spielen

