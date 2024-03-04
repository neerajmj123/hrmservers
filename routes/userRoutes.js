const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/createUser',userController.createUser);
router.get('/getuser',userController.getuser);
router.get('/:userId',userController.router);
router.put('/:userId',userController.updateUser);


module.exports = router;