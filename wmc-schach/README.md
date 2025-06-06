wmc Sommersemesterprojekt - chess multiplayer

Personen: Felix Zannantoni, Sebastian Schwingenschuh, Victor Ehrenmüller-Jensen

Ziel: ein Schach multiplayer

Struktur
wmc-schach/ 
│
├── public/ # Öffentlich zugängliche Dateien (vom Client geladen) 
│   ├── index.html # Hauptseite mit dem Schachbrett
│       ├── game.html
│       ├── rules.html
│       └──  legends.html
│   ├── style.css # Stile für das Layout
│   ├── client.js # Verbindet sich mit Server, steuert das Brett
│   ├── pictures/
│   └── libs/
│       ├── chess.min.js # chess.js – Spiellogik (Zugregeln, Matt usw.) 
│       ├── chessboard.js # chessboard.js – Anzeige des Brettes 
│       └── chessboard.css # Styles für das Schachbrett
│ 
├── server/ # Serverseitiger Code (Node.js + Socket.IO) 
│   ├── index.js # Einstiegspunkt, setzt Express + Socket.IO auf 
│   ├── gameManager.js # Spiellogik: Räume, Spielstatus, Zugvalidierung 
│   └── player.js # Verwaltung einzelner Spieler (optional) 
├── shared/ # Gemeinsame Logik (z. B. Schachzustände, Hilfsfunktionen) 
│       └── gameState.js # Struktur für Schachspiel (z. B. Brett, Züge) 
├── package.json # NPM-Konfiguration
└── README.md # Projektbeschreibung
