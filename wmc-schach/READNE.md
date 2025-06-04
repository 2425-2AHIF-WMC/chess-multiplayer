Struktur
wmc-schach/ 
│
├── public/ # Öffentlich zugängliche Dateien (vom Client geladen) 
│   ├── index.html # Hauptseite mit dem Schachbrett 
│   ├── style.css # Stile für das Layout 
│   ├── client.js # Verbindet sich mit Server, steuert das Brett 
│   └── libs/
│       ├── chess.min.js # chess.js – Spiellogik (Zugregeln, Matt usw.) 
│       ├── chessboard.min.js # chessboard.js – Anzeige des Brettes 
│       └── chessboard.min.css # Styles für das Schachbrett
│ 
├── server/ # Serverseitiger Code (Node.js + Socket.IO) 
│   ├── index.js # Einstiegspunkt, setzt Express + Socket.IO auf 
│   ├── gameManager.js # Spiellogik: Räume, Spielstatus, Zugvalidierung 
│   └── player.js # Verwaltung einzelner Spieler (optional) 
├── shared/ # Gemeinsame Logik (z. B. Schachzustände, Hilfsfunktionen) 
│       └── gameState.js # Struktur für Schachspiel (z. B. Brett, Züge) 
├── package.json # NPM-Konfiguration
└── README.md # Projektbeschreibung