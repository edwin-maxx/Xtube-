const Message = require("./models/Message");

module.exports = (server) => {
  const io = require("socket.io")(server);

  let online = 0;

  io.on("connection", (socket) => {
    online++;
    io.emit("online-users", online);

    socket.on("chat-message", async (msg) => {
      const saved = await Message.create(msg);
      io.emit("chat-message", saved);
    });

    socket.on("disconnect", () => {
      online--;
      io.emit("online-users", online);
    });
  });
};
