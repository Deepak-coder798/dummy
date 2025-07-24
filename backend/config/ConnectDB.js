const mongoose = require('mongoose');

const ConnectDB = async()=>{
    try{
         await mongoose.connect(process.env.MONGO_URL);
         console.log("MongoDB Connected Successfully!");
    }
    catch(error){
         console.log("Error:", error);
         process.exit(-1);
    }
}

module.exports = ConnectDB;