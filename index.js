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

io.on("connection", socket => {
  socket.on("join", function(data) {
    socket.join(data.room);
    io.in(data.room).emit("onDataReceived", data);
    console.log("Socket joined the room", data.room);
  });

  socket.on("leave", function(data) {
    socket.leave(data.room);
    io.in(data.room).emit("onDataReceived", data);
    console.log("Socket left the room", data.room);
  });
  socket.on("onDataReceived", function(data) {
    socket.broadcast.to(data.room).emit("onDataReceived", data);
    console.log("onDataReceived:", data);
  });
});
