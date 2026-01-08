const router = require("express").Router();
const Video = require("../models/Video");


router.get("/", async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});


router.get("/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });
  res.json(video);
});


router.post("/:id/view", async (req, res) => {
  await Video.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 }
  });
  res.json({ success: true });
});

module.exports = router;
    
