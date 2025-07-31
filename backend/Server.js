const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');
const ConnectDB = require('./config/ConnectDB')
const userRouter = require('./routes/User.Route')
const postRouter = require('./routes/Post.Route')
const app    = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
ConnectDB();

app.use('/',userRouter);
app.use('/',postRouter)






app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
});