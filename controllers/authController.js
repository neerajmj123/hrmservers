const success_function = require("../util/response-handler").success_function;
const error_function = require('../util/response-handler').error_function;
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const users = require("../db/models/users");
const isEmpty = require('../validation/isEmpty');
const validator = require('validator');
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
            });
            response.errors = userErrors;
            res.status(response.statusCode).send(response);
            return;
        } else {
            if (email && password) {
                let user = await users.findOne({ $and: [{ email: email }] })
                console.log("user", user)
                if (!user) {
                    let response = error_function({ statusCode: 400, message: "User not exist" })
                    res.status(response.statusCode).send(response);
                    return;
                }
                if (user) {
                    let db_password = user.password;
                    console.log("db_password", db_password)

                    bcrypt.compare(password, db_password, (error, auth) => {
                        if (auth === true) {

                            let access_token = jwt.sign(
                                { user_id: user.user_id },
                                process.env.PRIVATE_KEY,
                                { expiresIn: "1d" }
                            );
                            let response = success_function({
                                statusCode: 200,
                                data: access_token,
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
exports.checkRevoked = function(req,res){
    return new Promise((resolve, reject)=>{
        const authHeader = req.headers["authorization"]
        const token = authHeader.split("")[1];

        revokeuser.checkRevoked(token)
                  .then((message)=>{
                    resolve(message);
                  })
                  .catch((error)=>{
                    reject(error)
                  });
    });
};