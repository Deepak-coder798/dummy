const jwt = require('jsonwebtoken');

const varifyToken = (req,res,next)=>{
   const authorization = req.headers.authorization;
   const token = authorization.split(' ')[1]
   jwt.verify(token,process.env.SECRAT_KEY,(error,decoded)=>{
     if(error){
        return res.status(500).json({message:"Invalid Token"});
     }
     else
     {
         req.user=decoded;
     }
     next();
   })
}

module.exports = varifyToken;