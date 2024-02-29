const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/createUser',userController.createUser);
router.get('/getuser',userController.getuser);


module.exports = router;