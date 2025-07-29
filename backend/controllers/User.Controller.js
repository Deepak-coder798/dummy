const User = require('../models/User.Model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Signup = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password)
    {
        return res.status(500).json({message:"Fill all the Fields!"});
    }
    
    try{
        const hashPass = await bcrypt.hash(password,10);
        if(hashPass)
        {
        const user = new User({name,email,password:hashPass});
        await user.save();
        res.status(200).json({message:"User Created Successfully!",user})
        }
    }
    catch(error){
        res.status(500).json({message:error,rrr:"hello"})
    }
}

const Login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password)
    {
        return res.status(500).json({message:"Fill all the Fields!"});
    }
    
    try{
        const user = await  User.findOne({email});
        if(user)
        {
            const ress = await bcrypt.compare( password, user.password);
            if(!ress)
            {
                 res.status(500).json({message:"Invalid Cridentials!"});
            }
            else{
                const token = await jwt.sign({id:user._id},process.env.SECRAT_KEY);
                res.status(200).json({message:"Logined Successfully!",token,user});
               
            }
        }
        else{
            res.status(404).json({message:"User Not Found!"});
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error})
    }
}

// GET /getUser/:id
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId)
      .select('-password') // don't send password
      .populate('followers', 'name email profileImage')
      .populate('following', 'name email profileImage');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// PUT /uploadProfileImage/:id
const addProfileImage = async (req, res) => {
  const userId = req.params.id;
  const { profileImage } = req.body;

  if (!profileImage) {
    return res.status(400).json({ message: 'Profile image is required' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile image updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile image', error: err.message });
  }
};



// PUT /follow/:userId/:targetId
const followUserOrUnfollow = async (req, res) => {
  const { userId, targetId } = req.params;

  if (userId === targetId)
    return res.status(400).json({ message: 'You cannot follow yourself' });

  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!user || !target)
      return res.status(404).json({ message: 'User not found' });

    const isFollowing = user.following.includes(targetId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(userId, {
        $pull: { following: targetId },
      });
      await User.findByIdAndUpdate(targetId, {
        $pull: { followers: userId },
      });

      res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      // Follow
      await User.findByIdAndUpdate(userId, {
        $addToSet: { following: targetId },
      });
      await User.findByIdAndUpdate(targetId, {
        $addToSet: { followers: userId },
      });

      res.status(200).json({ message: 'Followed successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing follow/unfollow', error: err.message });
  }
};


module.exports = {
    Signup,
    Login,
    followUserOrUnfollow,
    addProfileImage,
    getUserById,
}