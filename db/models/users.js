const mongoose = require('mongoose')
const users = new mongoose.Schema({
    name :{
        type:String,
        required:true,
    },
    age:{
        type:String,
        required:true,
    },
    phone_no:{
        type:String,
        required:true,
    },
    pincode:{
        type:String,
        required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type :String,
        unique :true,
    }
})
module.exports=mongoose.model("users",users);
