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
        type:String
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type :String,
        unique :true,
    },
    user_type :{type :mongoose.Schema.Types.ObjectId,ref:"user_types"}
})
module.exports=mongoose.model("users",users);
