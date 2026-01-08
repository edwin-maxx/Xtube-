const Message = require("./models/Message");

module.exports = (server) => {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("chat-message", async (msg) => {
      const saved = await Message.create(msg);
      io.emit("chat-message", saved);
    });
  });
};
