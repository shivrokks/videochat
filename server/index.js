const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("build")); // your frontend build

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("room:join", ({ email, room }) => {
    socket.join(room);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.emit("room:join", { room });
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});