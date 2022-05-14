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

// prepare gamestate
let gamestate = {};

// prepare controls
let controls = {}

// listen for connection
io.on('connection', socket => {

    console.log(`${socket.id} has connected`);

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
setInterval(() => { io.volatile.emit('update', gamestate); }, 1000 / 10);

// step/simulate the gamestate forward in time (based on input)
setInterval(tick, 1000 / 30);
function tick() {
    for (let id in gamestate) { // for every user
        if (controls[id].isRotating) gamestate[id].rotation += 0.1;
        if (controls[id].isTranslating) {
            gamestate[id].x -= 0.1 * Math.sin(gamestate[id].rotation);
            gamestate[id].y += 0.1 * Math.cos(gamestate[id].rotation);
        }
    }
}
