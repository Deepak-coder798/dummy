const Post = require('../models/Post.Model');

const CreatePost = async(req,res)=>{
    const {title,imageUrl,description} = req.body;
    if(!title || !imageUrl || !description)
    {
        return res.status(404).json({message:"Fill all the fields!"});
    }
    try{ 
        const post = new Post({title,imageUrl,description,like:[],comment:[]});
        await post.save();

        res.status(200).json({message:"Blog Posted Successfully!"});

    }
    catch(error)
    {
        res.status(500).json({error});
    }
}

const getPost = async(req,res)=>{
   try{
      const posts = await Post.find();
      if(posts)
      {
      res.status(200).json({message:"Data Fetched!",posts});
      }
      else{
        res.status(404).json({message:"Data not Found!"});
      }
   }
   catch(error){
    res.status(500).json({error});
   }
}

module.exports = {
    CreatePost,
    getPost
}