const express = require('express')
const contactRoutes = express.Router()
const contactUs = require('../controllers/miscellaneous.controller')
// import {
//   contactUs,
//   userStats,
// } from '../controllers/miscellaneous.controller.js';
// import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';



// {{URL}}/api/v1/
contactRoutes.post('/contactus',contactUs)
// router
//   .route('/admin/stats/users')
  // .get(isLoggedIn, authorizeRoles('ADMIN'), userStats);

  module.exports = contactRoutes;
