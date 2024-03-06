const validator = require("validator")
const isEmpty = require('./isEmpty')
const user = require('../db/models/users')

module .exports = async function userValidaion(data){
    
    let error={};
    data.name=isEmpty(data.name)?data.name:"";
    data.age=isEmpty(data.age)?data.age:"";
    data.email = isEmpty(data.email)?data.email:"";
    data.password = isEmpty(data.password)?data.password:"";
    data.phone_no =isEmpty(data.phone_no)?data.phone_no:"";
    data.pincode = isEmpty(data.pincode)?data.pincode:"";

    if(validator.isEmpty(data.name)){
        error.name("Name is requirred")
    }
    if(!validator.isAlpha(data.name)){
        error.name("Only alphabets")
    }
    if(!validator.isLength(data.name,{min:6,max:15})){
        error.name("Charcters btw 6 to 15")
    }
    if(validator.isEmpty(data.age)){
        error.pincode("Age is required")
    }
    if(validator.isEmpty(data.email)){
        error.email("Email required")
    }
    if(!validator.isEmail(data.email)){
        error.email("email is invalid")
    } 
    let emailCount = await user.countDocuments({
        "email":data.email,
    })
    
}