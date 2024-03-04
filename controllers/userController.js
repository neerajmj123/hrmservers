const users = require('../db/models/users')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const success_function = require('../util/response-handler').success_function;
const error_function = require('../util/response-handler').error_function;
const{response}= require('express')
exports.createUser = async function(req,res){
    try {
        const name = req.body.name;
        const age = req.body.age;
        const email = req.body.email;
        const password = req.body.password;
        const phone_no = req.body.phone_no;
        const pincode = req.body.pincode;
        const isUserExist = await users.findOne({email})
        console.log("User exist",isUserExist);


        if(isUserExist){
            let response = error_function({
                statusCode :400,
                message :"User already exist",
            })
            res.status(response.statusCode).send(response.message);
            return;
        }
        let salt = await bcrypt.genSalt(10);
        console.log("salt",salt)
        let hashed_password = bcrypt.hashSync(password,salt)
        console.log('hashed_password',hashed_password)
        const new_user = await users.create({
            name,
            age,
            email,
            password :hashed_password,
            phone_no,
            pincode,
        })
        let response_obj ={
            name,
            age,
            email,
            password,
            phone_no,
            pincode,

        }
        if(new_user){
            let response=success_function({
                statusCode:201,
                data:new_user,
                message:"User Created Succesfully",
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
exports.getuser = async function(req,res){
    try {
        const listusers = await users.find();
        if(listusers && listusers.length>0){
            const response ={
                statusCode :200,
                message :"Success",
                data:listusers
            };
            res.status(200).send(response);
        }else{
            const response ={
                statusCode:404,
                message:"Users not Found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        console.error("Error fetching user",error);
        const response={
            statusCode:500,
            message:"Internal server error"
        };
        res.status(500).send(response)
    }
}
exports.router=async function(req,res){
    try {
        const userId =req.params.userId;
        const user=await users.findById(userId)
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.json(user);
    } catch (error) {
        console.error('error fetching user details',error)
        res.status(500).json({error:'server error'})
    }
}

exports .updateUser = async function(req,res){
    try {
        const userId = req.params.userId;
        const updateUser = req.body;

        const user = await users.findById(userId)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        await users.findByIdAndUpdate(userId,updateUser,{new:true});
        const updatedUser =await users.findById(userId)
        res.status(200).json({message:"user updated succesfully",user:updatedUser})
    } catch (error) {
        console.error("Error updating user details",error);
        res.status(500).json({error:"server error"})
    }
}