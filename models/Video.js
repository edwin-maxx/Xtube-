const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  videoUrl: String,
  creator: String,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", VideoSchema);
