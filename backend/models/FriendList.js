const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    }
  },
  { _id: false }
);

const friendListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    friends: [friendSchema]
  },
  { timestamps: true }
);

friendListSchema.index({ userId: 1 });

module.exports = mongoose.model("FriendList", friendListSchema);
