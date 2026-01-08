const router = require("express").Router();
const Message = require("../models/Message");

router.get("/", async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: 1 }).limit(100);
  res.json(msgs);
});

module.exports = router;
