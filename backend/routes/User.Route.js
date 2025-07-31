const express = require('express');
const router = express();
const {Signup, Login, getUserById, followUserOrUnfollow, addProfileImage} = require('../controllers/User.Controller')
const varifyToken = require('../middlewares/Varification')


router.post('/signup',Signup);
router.post('/login',Login);
router.get('/getUser/:id',getUserById);
router.put('/follow/:userId/:targetId',followUserOrUnfollow);
router.put('/uploadProfileImage/:id',addProfileImage);
router.get('/verify-token',varifyToken,(req,res)=>{
    res.status(200).json({message:"Token Varified!",userId:req.user})
});

module.exports = router;