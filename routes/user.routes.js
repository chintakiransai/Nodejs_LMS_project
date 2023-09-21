const express =require('express')
const userRoutes = express.Router()
const { usercreate, userlogin, userdetails, userlogout, userpassupdate } = require('../controllers/user.controllers')
const {isLoggedIn} = require('../middleware/auth.middleware.js')

const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });

userRoutes.post('/usercreate',upload.single('avatar'),usercreate)
userRoutes.post('/userlogin',userlogin)
userRoutes.get('/userdetails',isLoggedIn,userdetails)
userRoutes.get('/userlogout',userlogout)
userRoutes.post('/userpassupdate',isLoggedIn,userpassupdate)



module.exports=userRoutes
