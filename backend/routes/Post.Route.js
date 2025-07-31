const express = require('express');
const app = express();
const {CreatePost, getPost, getPostById, deletePost, doLike, addComment, deleteComment} = require('../controllers/Post.Controller')

app.post('/addPost/:id',CreatePost)
app.get('/getPost',getPost)
app.put('/doLike/:userId/:postId',doLike)
app.put('/addComment/:userId/:postId',addComment)
app.get('/getPostById/:id',getPostById)
app.delete('/deletePost/:id',deletePost)
app.delete('/deleteComment/:userId/:postId/:commentId',deleteComment)

module.exports = app;