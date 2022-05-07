// Setup server
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);
const gamedirectory = path.join(__dirname, "client");
app.use(express.static(gamedirectory));
const port = process.env.PORT || 3000;
httpserver.listen(port);

// Prepare gameState
let gameState = {
    players: {},
}

// Listen for client connection to server
io.on('connection', socket => {
    // Upon connection:

    // Create player for this client
    let player = {
        color: '#' + (Math.floor(Math.random() * 16777215)).toString(16),
        position: {
            x: Math.floor(Math.random() * 700),
            y: Math.floor(Math.random() * 700)
        },
        controls: { // 1: active, -1: inactive
            up: -1, 
            down: -1,
            left: -1,
            right: -1, 
        }
    } // Add this new player to gameState
    gameState.players[socket.id] = player;

    // Start listening for input from client
    socket.on('input', data => {
        
        // Use client input to modify gameState
        gameState.players[socket.id].controls[data] *= -1;
    });

    // Listen for client disconnection
    socket.on('disconnect', () => {
        delete gameState.players[socket.id];
    });
})

// Send regular updates to client
function update() {
    movePlayers();
    io.volatile.emit('update', gameState);
    setTimeout(update, 0);
}
update();

function movePlayers() {
    for (const player of Object.values(gameState.players)) {
        for (const key of Object.keys(player.controls)) {
            if (player.controls[key] > 0) {
                movePlayer(player, key);
            }
        }
    }
}

let speed = 0.5;
function movePlayer(player, key) {
    let p = player.position; 
    if (key == 'up' && p.y > 0) {
        p.y -= speed;
    } else if (key == 'down' && p.y < 750) {
        p.y += speed;
    } else if (key == 'left' && p.x > 0) {
        p.x -= speed;
    } else if (key == 'right' && p.x < 750) {
        p.x += speed;
    }
}