const express = require('express');
const { signIn, signUp, getUser} =require('../controller/authController');
const jwtAuth = require('../middleware/jwtAuth');
const authRouter = express.Router()



authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.get('/user',jwtAuth, getUser)


module.exports= authRouter