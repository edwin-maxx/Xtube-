const router = require("express").Router();
const Comment = require("../models/Comment");


router.get("/:videoId", async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
  res.json(comments);
});


router.post("/:videoId", async (req, res) => {
  const { username, text } = req.body;

  const comment = await Comment.create({
    videoId: req.params.videoId,
    username,
    text
  });

  res.json(comment);
});


router.post("/reply/:commentId", async (req, res) => {
  const { username, text } = req.body;

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  comment.replies.push({ username, text, createdAt: new Date() });
  await comment.save();

  res.json(comment);
});

module.exports = router;
