require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");

const app = express();
const server = http.createServer(app);


require("./socket")(server);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("tube"));

app.use("/api/videos", require("./routes/videos"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/messages", require("./routes/messages"));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/tube/home.html");
});

app.get("/watch", (req, res) => {
  res.sendFile(__dirname + "/tube/watch.html");
});

app.get("/upload", (req, res) => {
  res.sendFile(__dirname + "/tube/upload.html");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
              
