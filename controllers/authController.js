const success_function = require("../util/response-handler").success_function;
const error_function = require('../util/response-handler').error_function;
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const users = require("../db/models/users");
const isEmpty = require('../validation/isEmpty');
const validator = require('validator');
const {listeners} = require('../db/models/user_types')
const resetpassword = require('../util/email-template/resetpaswword').resetpassword;
const sendEmail = require('../util/send-email').sendEmail;
let dotenv = require('dotenv')
dotenv.config();

exports.login = async function (req, res) {
    try {

        let email = req.body.email;
        console.log("email", email);
        let password = req.body.password;
        console.log("password", password);

        async function loginValidate(data) {
            let errors = {};

            data.email = !isEmpty(data.email) ? data.email : "";
            data.password = !isEmpty(data.password) ? data.password : "";

            if (validator.isEmpty(data.email)) {
                errors.email = "Email required";
            } else if (!validator.isEmail(data.email)) {
                errors.email = "email is invalid";
            }
            if (validator.isEmpty(data.password)) {
                errors.password = "Password required"
            }
            return {
                validUser: isEmpty(errors),
                userErrors: errors,
            }
        }
        const { validUser, userErrors } = await loginValidate(req.body)
        console.log("userValid", validUser);
        console.log("userError", userErrors);

        if (!validUser) {
            let response = error_function({
                statusCode: 400,
                message: "validation error",
                errors:userErrors,
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            if (email && password) {
                let user = await users.findOne({
                      email: email  })
                console.log("user", user)
                if (!user) {
                    let response = error_function({ 
                        statusCode: 400,
                         message: "User not exist" })
                    res.status(response.statusCode).send(response);
                    return;
                }

                let firstLogin = !user.lastLogin;
                if(firstLogin){
                    await users.updateOne({email :email},{$set:{lastLogin:new Date()}})
                }
                if (user) {
                    let db_password = user.password;
                    console.log("db_password", db_password)

                    bcrypt.compare(password, db_password, (error, auth) => {
                        if (auth === true) {

                            let access_token = jwt.sign(
                                { user_id: user._id },
                                process.env.PRIVATE_KEY,
                                { expiresIn: "1d" }
                            );
                            let response = success_function({
                                statusCode: 200,
                                data:{
                                    token :access_token,
                                    lastLogin : user.lastLogin,
                                    user_type :user.user_type,
                                },
                                message: "login Succcesfull"
                            });
                            res.status(response.statusCode).send(response);
                            return;

                        } else {
                            let response = error_function({
                                statusCode: 401,
                                message: "Invalid Password"
                            })
                            res.status(response.statusCode).send(response)
                            return;
                        }
                    });
                } else {
                    let response = error_function({
                        statusCode: 401,
                        message: "Invalid Credential",
                    })
                    res.status(response.statusCode).send(response);
                    return;
                }
            } else {
                if (!email) {
                    let response = error_function({
                        statusCode: 422,
                        message: "Email is required"
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }
                if (!password) {
                    let response = success_function({
                        statusCode: 422,
                        message: "password requires"
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }
            }
        }
    } catch (error) {
        console.log("error : ", error);
        if (process.env.NODE_ENV == "Production") {
            console.log("Production error catch...")
            let response = error_function({
                statusCode: 400,
                message: error
                    ? error.message
                        ? error.message
                        : error
                    : "something went Wrong"
            })
            res.status(response.statusCode).send(response);
            return;
        } else {
            console.log("Development error catch");
            let response = error_function({ statusCode: 400, message: error });
            res.status(response.statusCode).send(response)
            return;
        }
    }
}
exports.forgetpassword = async function (req,res){
    try {
        let email = req.body.email;

        if(!email){
            let response = error_function({
                statusCode :422,
                message :'email is required'
            });
            return res.status(response.statusCode).send(response);
        }
        let user = await users.findOne({email:email})
            if(!user){
                let response = error_function({
                    statusCode : 404,
                    message : "user not found",
                })
                return res.status(response.statusCode).send(response);
            }
                let resetToken = jwt.sign({user_id:user._id},process.env.PRIVATE_KEY,{expiresIn:"10m"});

                let data = await users.updateOne(
                    {email:email},
                    {$set:{password_token : resetToken}}
                );

                if(data.matchedCount === 1 && data.modifiedCount == 1){
                    let reset_link = `${process.env.FRONTEND_URL}/passwordreset?token=${resetToken}`;
                    let emailTemplate = await resetpassword(user.name,reset_link);
                    await sendEmail(email,"forgot password",emailTemplate)


                    let response = success_function({
                        statusCode:200,
                        message :"email sent successfully"
                    });
                    res.status(statusCode).send(response)
                    return;
                }else{
                    let response = error_function({
                        statusCode:404,
                        message:"password reset failed",
                    });
                    res.status(statusCode).send(response);
                    return;
                }
    } catch (error) {
        let response=error_function({
                
            statusCode:400,
            message:"something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.passwordreset = async function(req,res){
    try {
        const authHeader = req.headers['authorization'];

        if(!authHeader){
            let response = error_function({
                statusCode : 401,
                message:"Authorization header not received"
            })
            return res.status(response.statusCode).send(response);
        }
        const token = authHeader.split(" ")[1];

        let password = req.body.password;

        if(!password){
            let response = error_function({
                statusCode : 422,
                message : " password required"
            })
            return res.status(response.statusCode).send(response);
        }
        let decoded;
        try {
            decoded = jwt.verify(token,process.env.PRIVATE_KEY);
        } catch (error) {
            let response = error_function({
                statusCode : 403,
                message:"invalid or expired token"
            })
            return res.status(response.statusCode).send(response);
        }
        let user = await users.findOne({
            _id:decoded.user_id,
            password_token:token
        });
        if(!user){
            let response = error_function({
                statusCode:404,
                message :"user not found or invalid token"
            });
            return res.status(response.statusCode).send(response);
        }
        let salt = bcrypt.genSaltSync(10);
        let password_hash = bcrypt.hashSync(password,salt)

        let data = await users.updateOne(
            {_id : decoded.user_id},
            {$set : {password:password_hash,password_token:null}}
        );

        if(data.matchedCount === 1 && data.modifiedCount === 1){
            let response = success_function({
                statusCode :200,
                message : 'password changed succesfully'
            });
            return res.status(response.statusCode).send(response);
        }else{
            let response = error_function({
                statusCode :400,
                message :"password reset failed"
            });
            return res.status(response.statusCode).send(response)
        }
    } catch (error) {
        let response = error_function({
            statusCode :500,
            message : 'internal server error'
        })
        return res.status(response.statusCode).send(response);
    }
}
exports.changePassword = async function(req,res){
    const {currentPassword,newPassword} = req.body;
    console.log(currentPassword);
    console.log(newPassword);
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if(!authHeader){
        let response = error_function({
            statusCode : 401,
            message: "Authorization header not received"
        })
        return res.status(response.statusCode).send(response);
        
    }
    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token,process.env.PRIVATE_KEY);
        console.log("reached here")

        const UserId = decodedToken.user_id;

        const user = await users.findById(UserId)
        if(!user){
            let response = error_function({
                statusCode:404,
                message:"no such user"
            })
            return res.status(response.statusCode).send(response);
        }

        const currentpasswordvalid = await bcrypt.compare(currentPassword,user.password);
        if(!currentpasswordvalid){
            let response = error_function({
                statusCode : 400,
                message : " current password is incorrect"
            });
            return res.status(response.statusCode).send(response);
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);
        await users.findByIdAndUpdate(UserId,{password:hashedPassword});

        let response = success_function({
            statusCode :200,
            message :"Password changed succesfully"
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        let response = error_function({
            statusCode : 500,
            message: error.message || "interrnal server error"
        });
        return res.status(response.statusCode).send(response)
    }
};
exports.checkRevoked = function(req,res){
    return new Promise((resolve, reject)=>{
        const authHeader = req.headers["authorization"]
        const token = authHeader.split(" ")[1];

        revokeuser.checkRevoked(token)
                  .then((message)=>{
                    resolve(message);
                  })
                  .catch((error)=>{
                    reject(error)
                  });
    });
};