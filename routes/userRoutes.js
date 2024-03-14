const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const accesscontrol= require ("../util/accesscontrol").accesscontrol;

const setAccessControl = (accessType)=>{
    return(req,res,next)=>{
        accesscontrol(accessType,req,res,next)
    }
}

router.post('/createUser',setAccessControl('1'),userController.createUser);
router.get('/getuser',setAccessControl('1'),userController.getuser);
router.get('/:userId',userController.router);
router.put('/:userId',userController.updateUser);


module.exports = router;