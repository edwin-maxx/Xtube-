require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

require("./socket")(server);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "tube")));
app.use(express.static(__dirname));
app.use("/icons", express.static(path.join(__dirname, "icons")));

app.use("/api/videos", require("./routes/videos"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/messages", require("./routes/messages"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "tube", "home.html"));
});

app.get("/watch", (req, res) => {
  res.sendFile(path.join(__dirname, "tube", "watch.html"));
});

app.get("/wtg", (req, res) => {
  res.sendFile(path.join(__dirname, "tube", "watchtg.html"));
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "tube", "upload.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
