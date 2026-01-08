const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  videoId: mongoose.Schema.Types.ObjectId,
  username: String,
  text: String,
  replies: [
    {
      username: String,
      text: String,
      createdAt: Date
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);
