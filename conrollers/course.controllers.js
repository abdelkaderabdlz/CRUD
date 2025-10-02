const express = require('express');
const app = express();

const Course = require('../models/course.model');
const {validationResult} = require('express-validator');

const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../midelweare/asyncWrrapper');

const appError = require('../utils/app.error');

app.use(express.json()) // bash ye9der ye9ra req.body bi sighat json

const getAllCourses = asyncWrapper(
    async(req,res,next)=>{
        const query = req.query;
        console.log(query);

        const limit = query.limit || 10;  // by default 10
        const page = query.page || 1;     // by default 1
        const skip = (page-1)*limit;

        const courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);
        if(!courses){
            const error =  appError.create("not found any course",404,httpStatusText.FAIL);
            return next(error);
        }
        res.status(200).json({status : httpStatusText.SUCCESS , data : {courses : courses} });
    }
) 

const getSingleCourse = asyncWrapper(
   async(req,res,next)=>{
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);
        if(course == null){
            const error = appError.create('not found course',404, httpStatusText.FAIL)
            return next(error);
        }
        return res.json({status : httpStatusText.SUCCESS , data : {course} });
        
    }
) 
        


const createCourse = asyncWrapper(
   async(req,res,next)=>{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const error = appError.create(errors.array(),400,httpStatusText.FAIL);
                return next(error);
            //    return res.status(400).json({status : httpStatusText.FAIL , data : errors.array() });
             }

        const newCourse =  new Course(req.body);
         await newCourse.save();
        res.status(201).json({status : httpStatusText.SUCCESS , data : {newCourse} });

    }   
) 

const UpdateCourse = asyncWrapper(
    async(req,res)=>{
    const courseId = req.params.courseId;
    const updatedCourse = await Course.updateOne({_id : courseId},{...req.body});
    res.status(200).json({status : httpStatusText.SUCCESS , data : {updatedCourse} });
}
) 

const deleteCourse = asyncWrapper(
      async(req,res)=>{
    const courseId = req.params.courseId;
    await Course.deleteOne({ _id: courseId });
    res.status(200).json({status : httpStatusText.SUCCESS , data : null });
}

) 
module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    UpdateCourse,
    deleteCourse
}