const express = require('express')
const router = express.Router();
const authCountroller = require('../controllers/authController')

router.post('/login',authCountroller.login);
module.exports = router;