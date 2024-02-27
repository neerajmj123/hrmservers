const users = require('../db/models/users')

const success_function = require('../util/response-handler').success_function;
const error_function = require('../util/response-handler').error_function;
const bcrypt = require('bcryptjs')
exports.createUser = async function(req,res){
    try {
        const name = req.body.name;
        const age = req.body.age;
        const email = req.body.email;
        const password = req.body.password;
        const phonenumber = req.body.phonenumber;
        const pincode = req.body.pincode;
        const dateofbirth = req.body.dateofbirth;
        const isUserExist = await users.findOne({email})
        console.log("User exist",isUserExist);


        if(isUserExist){
            let response = error_function({
                statusCode :400,
                message :"User already exist",
            })
            res.status(response.statusCode).send(response)
        }
        let salt = await bcrypt.genSalt(10);
        console.log("salt",salt)
        let hashed_password = bcrypt.hashSync(password.salt)
        console.log('hashed_password',hashed_password)
        const new_user = await users.create({
            name,
            age,
            email,
            password :hashed_password,
            phonenumber,
            pincode,
            dateofbirth
        })
        let response_obj ={
            name,
            age,
            email,
            password,
            phonenumber,
            pincode,
            dateofbirth

        }
        if(new_user){
            let response=success_function({
                statusCode:201,
                data:new_user,
                message:"User created succesfully",
            })
            res.status(response.statusCode).send(response);
            return;
        }else{
            let response = error_function({
                statusCode:400,
                message:"User creation Failed"
            })
            res.status(response.statusCode).send(response)
            return;
        }
    } catch (error) {
        console.log("error:",error);
        let response =error_function({
            statusCode : 400,
            message : error.message?error.message:error,
        })
        res.status(response.statusCode).send(response);
        return
    }
} 