const express = require('express')
const { create, getcourses, deletecourses, updatecourses, createlectures } = require('../controllers/course.controllers')
const {authorizationroles,userAuth }  = require('../middleware/auth.middleware.js')
const courseRoutes = express.Router()

courseRoutes.post('/create',userAuth,userAuth,authorizationroles('ADMIN'),create)
courseRoutes.get('/getcourses',getcourses)
courseRoutes.delete('/deletecourses/:courseid',deletecourses)
courseRoutes.put('/updatecourses/:courseid',updatecourses)


courseRoutes.post('/createlectures/:courseid',createlectures)
module.exports = courseRoutes