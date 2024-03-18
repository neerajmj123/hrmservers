const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController')
const accesscontrol = require("../util/accesscontrol").accesscontrol

const setAccessControl = (accesType)=>{
    return(req,res,next)=>{
        accesscontrol(accesType,req,res,next)
    }
}
router.post('/login',setAccessControl('*'),authController.login);
router.post('/forgetpassword',setAccessControl('*'),authController.forgetpassword)
module.exports = router;