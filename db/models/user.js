const mongoose = require('mongoose')
const users = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type :String,
        unique :true,
    }
})
module.exports=mongoose.model("users",users);
