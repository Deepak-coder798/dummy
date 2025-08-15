// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const ConnectDB = require('./config/ConnectDB');

// Import routes
const userRouter = require('./routes/User.Route');
const postRouter = require('./routes/Post.Route');
const Conversation = require('./routes/Conversation');
const FriendList = require('./routes/FriendList');
const messageRoutes = require('./routes/Messages'); // renamed for clarity

// Import socket setup
const setupChatSocket = require('./sockets/chatSocket');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());
app.use(cors());

// Connect DB
ConnectDB();

// Pass io to message routes
app.use('/', userRouter);
app.use('/', postRouter);
app.use('/api/message', (req, res, next) => {
  req.io = io; // attach socket instance to the request object
  next();
}, messageRoutes);
app.use('/api/conversation', Conversation);
app.use('/api/friendList', FriendList);

// Setup socket connections
setupChatSocket(io);

server.listen(PORT, () => {
  console.log(`✅ Server is running on Port ${PORT}`);
});
