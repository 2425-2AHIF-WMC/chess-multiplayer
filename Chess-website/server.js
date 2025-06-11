const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Spieler verbunden:', socket.id);

    let room = null;

    // Suche nach einem bestehenden Raum mit <2 Spielern
    for (let [key, value] of io.sockets.adapter.rooms) {
        if (!io.sockets.sockets.get(key) && value.size < 2) {
            room = key;
            break;
        }
    }


    if (!room) room = 'default-room'; // Wähle einen festen Raumnamen

    socket.join(room);
    socket.emit('joinedRoom', room);

    const clientsInRoom = Array.from(io.sockets.adapter.rooms.get(room));
    if (clientsInRoom.length === 2) {
        io.to(room).emit('gameStart', {
            white: clientsInRoom[0],
            black: clientsInRoom[1]
        });
    }

    // Empfange und sende Züge
    socket.on('move', (data) => {
        if (!data || typeof data !== 'object' || !data.from || !data.to) {
            console.warn("[SERVER] Ungültige Daten empfangen (move):", data);
            return;
        }
        console.log("[SERVER] move empfangen:", data);
        socket.to(data.room).emit('move', {
            from: data.from,
            to: data.to,
            notation: data.notation
        });
    });




    socket.on('disconnect', () => {
        console.log('Spieler getrennt:', socket.id);
    });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server läuft auf Port ' + PORT);
});
