const users = require('../db/models/users')
const success_function = require('../util/response-handler').success_function;
const error_function = require('../util/response-handler').error_function;
const bcrypt = require('bcryptjs')
exports.createUser = async function(req,res){
    try {
        const name = req.body.name;
        const age = req.body.age;
        const phonenumber = req.body.phonenumber;
        const pincode = req.body.pincode;
        const dateofbirth = req.body.dateofbirth;
        const isUserExist = await users.findOne({phonenumber})
        console.log("User exist",isUserExist);


        if(isUserExist){
            let response = error_function({
                statusCode :400,
                message :"User already exist",
            })
            res.status(response.statusCode).send(response)
        }
    } catch (error) {
        
    }
} 