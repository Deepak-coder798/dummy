const express = require("express");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const router = express.Router();

// Send a message (text or imageUrl)
router.post("/", async (req, res) => {
  try {
    const { conversationId, sender, receiver, text, imageUrl } = req.body;

    if (!conversationId) return res.status(400).json({ error: "conversationId required" });
    if (!receiver) return res.status(400).json({ error: "receiver required" });
    if (!text && !imageUrl) return res.status(400).json({ error: "text or imageUrl required" });

    const msg = await Message.create({
      conversationId,
      sender,
      receiver,
      text: text || "",
      imageUrl: imageUrl || null,
      read: false
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text || "📷 Image",
      lastMessageAt: new Date()
    });

    // ✅ Emit new message in real-time
    req.io.to(conversationId).emit("newMessage", msg);

    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// Get messages for a conversation (paginated)
router.get("/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 30 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json(messages.reverse());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Mark a message as read
router.patch("/:messageId/read", async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { read: true, $addToSet: { seenBy: req.user.id } },
      { new: true }
    );

    if (!message) return res.status(404).json({ error: "Message not found" });

    res.json(message);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
