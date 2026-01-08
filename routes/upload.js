const router = require("express").Router();
const multer = require("multer");
const uploadToCatbox = require("../catbox");
const Video = require("../models/Video");
const fs = require("fs");

const upload = multer({ dest: "temp/" });

router.post(
  "/",
  upload.single("video"),
  async (req, res) => {
    try {
      const { title, creator, thumbnail } = req.body;

      const videoUrl = await uploadToCatbox(req.file.path);

      fs.unlinkSync(req.file.path);

      const video = await Video.create({
        title,
        creator,
        thumbnail,
        videoUrl
      });

      res.json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;
