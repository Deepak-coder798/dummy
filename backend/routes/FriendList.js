const express = require("express");
const FriendList = require("../models/FriendList");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const list = await FriendList.findOne({ userId: id })
      .populate("friends.friendId", "name email profileImage")
      .populate("friends.conversationId", "lastMessage lastMessageAt updatedAt");
    res.json(list || { userId: id, friends: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
