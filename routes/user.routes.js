const express =require('express')
const { usercreate, userlogin, userdetails, userlogout, userpassupdate } = require('../controllers/user.controllers')
const userRoutes = express.Router()
const upload1 = require('../middleware/upload.middleware.js')
const {userAuth} = require('../middleware/auth.middleware.js')

userRoutes.post('/usercreate',upload1.single('avatar'),usercreate)
userRoutes.post('/userlogin',userlogin)
userRoutes.get('/userdetails',userAuth,userdetails)
userRoutes.get('/userlogout',userlogout)
userRoutes.post('/userpassupdate',userAuth,userpassupdate)



module.exports=userRoutes
