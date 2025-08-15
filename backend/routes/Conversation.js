const express = require("express");
const Conversation = require("../models/Conversation");
const FriendList = require("../models/FriendList");

const router = express.Router();

// Create or get existing 1:1 conversation
router.post("/", async (req, res) => {
  try {
    const { receiverId, me } = req.body;

    if (!receiverId) return res.status(400).json({ error: "receiverId required" });
    if (receiverId === me) return res.status(400).json({ error: "Cannot chat with yourself" });

    let convo = await Conversation.findOne({
      participants: { $all: [me, receiverId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] }
    });

    if (!convo) {
      convo = await Conversation.create({ participants: [me, receiverId] });

      // Upsert friend list entries
      await FriendList.updateOne(
        { userId: me },
        { $addToSet: { friends: { friendId: receiverId, conversationId: convo._id } } },
        { upsert: true }
      );
      await FriendList.updateOne(
        { userId: receiverId },
        { $addToSet: { friends: { friendId: me, conversationId: convo._id } } },
        { upsert: true }
      );
    }

    res.json(convo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get my conversations (with last message preview)
router.get("/mine", async (req, res) => {
  try {
    const me = req.user.id;
    const convos = await Conversation.find({ participants: me })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(convos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
