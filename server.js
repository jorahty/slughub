const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);
app.use(express.static(path.join(__dirname, "client")));
const port = process.env.PORT || 3000;
httpserver.listen(port);

// balance
const BROADCAST_RATE = 30;
const TICK_RATE = 30;
const ROTATE_SPEED = 0.1;
const TRANSLATE_SPEED = 0.1;

// prepare gamestate
let gamestate = {};

// prepare controls
let controls = {}

// listen for connection
io.on('connection', socket => {

    // add user to gamestate
    gamestate[socket.id] = {
        color: Math.random() * 0xffffff,
        x: -3 + Math.random() * 6,
        y: -3 + Math.random() * 6,
        rotation: Math.random() * 2 * Math.PI
    };

    // track user controls
    controls[socket.id] = {
        isRotating: false,
        isTranslating: false
    }

    // listen for input
    socket.on('input', code => {
        switch(code) {
        case 'R': controls[socket.id].isRotating = true; break;
        case 'T': controls[socket.id].isTranslating = true; break;
        case 'r': controls[socket.id].isRotating = false; break;
        case 't': controls[socket.id].isTranslating = false; break;
        }
    });

    // listen for disconnection
    socket.on('disconnect', () => {
        delete gamestate[socket.id];
        delete controls[socket.id];
    });
});

// emit regular updates to all clients
setInterval(() => { io.volatile.emit('update', gamestate); }, 1000 / BROADCAST_RATE);

// step/simulate the gamestate forward in time (based on input)
setInterval(tick, 1000 / TICK_RATE);
function tick() {
    for (let id in gamestate) { // for every user
        if (controls[id].isRotating) gamestate[id].rotation += ROTATE_SPEED;
        if (controls[id].isTranslating) {
            gamestate[id].x -= TRANSLATE_SPEED * Math.sin(gamestate[id].rotation);
            gamestate[id].y += TRANSLATE_SPEED * Math.cos(gamestate[id].rotation);
        }
    }
}
