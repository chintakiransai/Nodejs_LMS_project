const express = require('express')
const { createCourse, getAllCourses, createLecture, getLecturesByCourseId, updateCourse, deleteCourse, deleteLecture  } = require('../controllers/course.controllers')
const {authorizationroles, isLoggedIn }  = require('../middleware/auth.middleware.js')
const courseRoutes = express.Router()

const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });


courseRoutes.route('/')
.get(getAllCourses)
.post(isLoggedIn, authorizationroles('ADMIN'), upload.single('thumbnail'), createCourse)
.delete(deleteLecture)

courseRoutes.route('/:courseId')
.post(isLoggedIn, authorizationroles('ADMIN'), upload.single('lecture'),createLecture)
.get(isLoggedIn, getLecturesByCourseId)
.put(isLoggedIn, authorizationroles('ADMIN'),updateCourse)
.delete(isLoggedIn, authorizationroles('ADMIN'),deleteCourse)

module.exports = courseRoutes