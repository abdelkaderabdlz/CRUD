


const {getAllCourses,getSingleCourse,createCourse,UpdateCourse,deleteCourse} = require('../conrollers/course.controllers');
const verifyToken = require('../midelweare/verify.token');
const allowedto = require('../midelweare/allowedTo');

const express = require('express');
const router = express.Router();

const validation = require('../midelweare/validation');
const userRoles = require('../utils/user.roles');

router.route('/')
     .get (verifyToken,getAllCourses)
     .post(verifyToken,allowedto(userRoles.ADMIN),validation,createCourse)


router.route ('/:courseId')
    .get(getSingleCourse)
    .patch(UpdateCourse)
    .delete(verifyToken,allowedto(userRoles.ADMIN,userRoles.MANAGER),deleteCourse)




module.exports = router;