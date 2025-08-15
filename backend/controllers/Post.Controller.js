const Post = require('../models/Post.Model');

const CreatePost = async (req, res) => {
  const { title, imageUrl, description } = req.body;
  const userId = req.params.id;
  if (!title || !imageUrl || !description) {
    return res.status(404).json({ message: "Fill all the fields!" });
  }
  try {
    const post = new Post({ title, imageUrl, description, userId, like: [], comment: [] });
    await post.save();

    res.status(200).json({ message: "Blog Posted Successfully!" });

  }
  catch (error) {
    res.status(500).json({ error });
  }
}

const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
    .populate({
      path:'userId',
      select:'name profileImage'
    })
    .populate({
        path: 'comment.userId',
        select: 'name profileImage'
      });
    if (posts && posts.length > 0) {
      res.status(200).json({ message: "Data Fetched!", posts });
    } else {
      res.status(404).json({ message: "Data not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getPostById = async (req, res) => {
  const userId = req.params.id;
  console.log("userId", userId);
  try {
    const posts = await Post.find()
    .populate({
      path:'userId',
      select:'name profileImage'
    })
    .populate({
        path: 'comment.userId',
        select: 'name profileImage'
      });
    console.log("POSTS", posts);
    const response = await posts.filter((post) => post.userId._id.toString() === userId.toString());
    console.log("res:", response);
    if (response.length > 0) {
      res.status(200).json({ message: "Data Fetched!", response });
    }
    else {
      res.status(200).json({ message: "Data Not Found!",response });
    }

  }
  catch (error) {
    res.status(500).json({ error });
  }
}

const deletePost = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Post.findByIdAndDelete(id);
    if (response) {
      res.status(200).json({ message: "Post Deleted Successfully!" });
    }
    else {
      res.status(404).json({ message: "Post not Found!" });
    }
  }
  catch (error) {
    res.status(500).json({ error });
  }
}


const doLike = async (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({message:"Post not found!"});
    }

    const alreadyLiked = post.like.some(
      (like) => like.userId.toString() === userId.toString()
    );

    let updatedPost;

    if (alreadyLiked) {
      // Remove the like
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { like: { userId } } },
        { new: true }
      );
    } else {
      // Add the like
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { like: { userId } } },
        { new: true }
      );
    }

    return res.status(200).json({updatedPost});

    // res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ error })
  }
}

const addComment = async(req,res)=>{
 const userId = req.params.userId;
  const postId = req.params.postId
  const cmt  = req.body;
  console.log(cmt);
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({message:"Post not found!"});
    }


    let updatedPost;


      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { comment: { userId,cmt:cmt.comment } } },
        { new: true }
      );


    return res.status(200).json({message:"Comment Added Successfully!",updatedPost});

    // res.status(200).json({ post });
  }
  catch (error) {
    res.status(500).json({ error })
  }
}

const deleteComment = async (req, res) => {
  const { userId, postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comment.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await Post.findByIdAndUpdate(postId, {
      $pull: { comment: { _id: commentId } }
    });

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}


module.exports = {
  CreatePost,
  getPost,
  getPostById,
  deletePost,
  doLike,
  addComment,
  deleteComment
}