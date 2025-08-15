const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User.Model');

exports.getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages.map(msg => ({
      id: msg._id,
      senderId: msg.sender,
      receiverId: msg.receiver,
      content: msg.content,
      createdAt: msg.createdAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    // const conversations = await Message.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { sender: new mongoose.Types.ObjectId(userId) },
    //         { receiver: new mongoose.Types.ObjectId(userId) }
    //       ]
    //     }
    //   },
    //   { $sort: { createdAt: 1 } },
    //   {
    //     $group: {
    //       _id: {
    //         $cond: [
    //           { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
    //           "$receiver",
    //           "$sender"
    //         ]
    //       },
    //       lastMessage: { $last: "$$ROOT" },
    //       unreadCount: {
    //         $sum: { $cond: [{ $and: [{ $eq: ["$read", false] }, { $ne: ["$sender", new mongoose.Types.ObjectId(userId)] }] }, 1, 0] }
    //       }
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: '_id',
    //       foreignField: '_id',
    //       as: 'user'
    //     }
    //   },
    //   { $unwind: "$user" },
    //   {
    //     $project: {
    //       user: {
    //         id: "$user._id",
    //         name: "$user.name",
    //         avatar: "$user.avatar"
    //       },
    //       lastMessage: { content: "$lastMessage.content" },
    //       unreadCount: 1
    //     }
    //   }
    // ]);

    // res.json(conversations);

    const users = await User.find();
    if(users)
    {
        const data = await users.filter((data)=>data._id.toString()!==userId)
        if(data)
        {
            res.status(200).json({users:data});
        }
    }
    else{
        res.status(404).json({message:"Users Not Found!"}); 
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content
    });

    res.status(201).json({
      id: newMessage._id,
      senderId: newMessage.sender,
      receiverId: newMessage.receiver,
      content: newMessage.content,
      createdAt: newMessage.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
