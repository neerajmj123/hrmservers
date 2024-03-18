const validator = require("validator")
const isEmpty = require('./isEmpty')
const user = require('../db/models/users')

module .exports = async function userValidaion(data){
    
    let errors={};
    data.name=!isEmpty(data.name)?data.name:"";
    data.age=!isEmpty(data.age)?data.age:"";
    data.email = !isEmpty(data.email)?data.email:"";
    // data.password = !isEmpty(data.password)?data.password:"";
    data.phone_no =!isEmpty(data.phone_no)?data.phone_no:"";
    data.pincode = !isEmpty(data.pincode)?data.pincode:"";

    if(validator.isEmpty(data.name)){
        errors.name="Name is requirred";
    }
    if(!validator.isAlpha(data.name)){
        errors.name="Only alphabets";
    }
    if(!validator.isLength(data.name,{min:6,max:15})){
        errors.name="Charcters btw 6 to 15";
    }
    if(validator.isEmpty(data.age)){
        errors.age="Age is required";
    }
    if (validator.isEmpty(data.email)) {
        errors.email = "Email required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    } else {
        let emailCount = await user.countDocuments({ "email": data.email });
        if (Number(emailCount) > 0) {
            errors.email = "Email must be unique";
        }
    }
    // if(validator.isEmpty(data.password)){
    //     errors.password="password is required";
    // }
    if(!validator.isNumeric(data.phone_no)){
        errors.phone_no="Phone number required";
    }
    if(validator.isEmpty(data.pincode)){
        errors.pincode="Pincode is required";
    }
if(!validator.isNumeric(data.pincode))
errors.pincode="Pincode is invalid";

    return {
        validUser:isEmpty(errors),
        userError:errors,
    };
}