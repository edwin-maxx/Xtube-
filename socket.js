const Message = require("./models/Message");

module.exports = (server) => {
  const io = require("socket.io")(server);

  const onlineUsers = new Map(); // socket.id -> username

  io.on("connection", (socket) => {

    // ----- Join Room -----
    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);
      onlineUsers.set(socket.id, username);

      // Emit online users count
      io.emit("online-users", Array.from(onlineUsers.values()));

      // Notify others
      socket.to(roomId).emit("user-joined", { id: socket.id, username });

      // ----- WebRTC signaling -----
      socket.on("signal", ({ target, signal }) => {
        io.to(target).emit("signal", { from: socket.id, signal });
      });

      // ----- Video sync -----
      socket.on("video-sync", data => {
        socket.to(data.roomId).emit("video-sync", data);
      });

      // ----- Global chat -----
      socket.on("chat-message", async (msg) => {
        const saved = await Message.create(msg);
        io.emit("chat-message", saved);
      });
    });

    // ----- Disconnect -----
    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);

      // Emit updated online users
      io.emit("online-users", Array.from(onlineUsers.values()));

      // Notify rooms about leaving
      socket.broadcast.emit("user-left", socket.id);
    });
  });
};
