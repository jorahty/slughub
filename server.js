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
