const os = require("os");
const PRODUCTION_MODE = os.hostname() !== "Suranadira";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(PRODUCTION_MODE ? 443 : 9000);

app.use(express.static(__dirname + "/app/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app/public/index.html");
});

// Handle client connection
io.on("connection", socket => {
  // Emit on user joining the room
  socket.on("join", function(data) {
    socket.join(data.room);
    io.in(data.room).emit("onDataReceived", data);
    console.log("Socket joined the room", data.room);
  });

  // Emit on user leaving the room
  socket.on("leave", function(data) {
    socket.leave(data.room);
    io.in(data.room).emit("onDataReceived", data);
    console.log("Socket left the room", data.room);
  });

  // Broadcast on user sending message
  socket.on("onDataReceived", function(data) {
    socket.broadcast.to(data.room).emit("onDataReceived", data);
    console.log("onDataReceived:", data);
  });
});
