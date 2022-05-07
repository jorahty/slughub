const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const port = process.env.PORT || 3000;

const app = express();
const server = http.Server(app);
const io = socketio(server);

const gamedirectory = path.join(__dirname, "public");

app.use(express.static(gamedirectory));

server.listen(port);

var rooms = [];
var usernames = [];

io.on('connection', function(socket){

  socket.on("join", function(room, username){
    if (username != ""){
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("recieve", "Server : " + username + " has entered the chat.");
      socket.emit("join", room);
    }
  })

  socket.on("send", function(message){
    io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] +" : " + message);
  })

  socket.on("recieve", function(message){
    socket.emit("recieve", message);
  })
})
