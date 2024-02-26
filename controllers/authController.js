const success_function = require("../util/response-handler").success_function;
const error_function = require('../util/response-handler').error_function;
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const users = require("../db/models/users")

exports.login  = async function(req,res){
    try {
        let email = req.body.email;
        console.log("email",email);

        let password = req.body.password;
        console.log("password",password);

        if(email && password){
            let user = await users.findOne({$and:[{email:email}]})
            console.log("user",user)
            if(!user){
                let response = error_function({"status" : 400,"message":"Email invalid"})
                res.status(response.statusCode).send(response);
                return
            }
            if(user){
                let db_password = user.password;
                console.log("dbpassword",db_password)

                bcrypt.compare(password,db_password,(error,auth)=>{
                    if(auth === true){
                        let access_token = jwt.sign(
                            {user_id :user._id},
                            process.env.PRIVATE_KEY,
                            {expiresIn:"1d"}
                        );
                        let response = success_function({
                            status:200,
                            data :access_token,
                            message :"login Succcesfull"
                        })
                        res.status(response.statusCode).send(response);
                        return;

                    }else{
                        let response = error_function({
                        statusCode:401,
                        message:"Invalid Password"
                    })
                    res.status(response.statusCode).send(response)
                    return;
                    }
                })
            }else{
                let response = error_function({
                    statusCode :401 ,
                    message :"Invalid Credential",
                })
                res.status(response.statusCode).send(response);
                return;
            }
        }else{
            if(!email){
                let response = error_function({
                    statusCode :422,
                    message:"Email is required"
                });
                res.status(response.statusCode).send(response); 
                return;
            }
            if(!password){
                let response= success_function({
                    statusCode :422,
                    message :"password requires"
                });
                res.status(response.statusCode).$and(response);
                return;
            }
        }
    } catch (error) {
        if(process.env.NODE_ENV =="Production"){
            let response = error_function({
                statusCode :400,
                message:error
                ?error.message
                ?error.message
                :error
                :"something went Wrong"
            })
            res.status(response.statusCode).send(response);
            return;
        }else{
            let response= error_function({statusCode:400,message:error});
            res.status(response.statusCode).send(response)
            return;
        }   
    }
}