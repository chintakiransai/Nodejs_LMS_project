
const courseModel = require("../schema/course.model");
const AppError = require("../utils/appError");

exports.create= async (req,res,next) =>
{
   try {
    const { title,description,category, createdby} = req.body
    if(!title || !description || !category || !createdby)
    {
        next(new AppError("All fields are required",400))
    }
       const courseExists = await courseModel.findOne({title})
    if(courseExists)
    {
        next(new AppError("Course already Exist",400))
    }

    const createCourse = await courseModel.create({ title,description,category, createdby})
       
   if(createCourse) 
   {
        res.status(200).json({
        message:"Course created Successfully"
        })
   }
   else {
    next(new AppError("Course failed to create",400))
   }
   } catch (error) {
    next(new AppError(error.message,500))
   }
}


exports.getcourses=async (req,res,next) => {
    try {
        const courses = await courseModel.find({})
        res.status(200).json({
            data: courses,
            message:"get courses details"
        })  
    } catch (error) {
        next(new AppError(error.message,500))
    }
}


exports.deletecourses = async (req,res,next) => {
    try {
        const { courseid } = req.params
        const course = await courseModel.findById(courseid)
        if(!course)
        {
            next(new AppError("course not found",400))
        }
        else{
            await courseModel.findByIdAndDelete(courseid)
            res.status(200).json({
                message:"course deleted"
            })  
        }
    } catch (error) {
        next(new AppError(error.message,500))
    }
}


exports.updatecourses = async (req,res,next) => {
    try {
        const { courseid } = req.params
        const course = await courseModel.findById(courseid)
        if(!course)
        {
            next(new AppError("course not found",400))
        }
        await courseModel.findByIdAndUpdate(courseid,
            {
                $set:req.body
            })
            res.status(200).json({
                message:"course updated"
            })  

    } catch (error) {
        next(new AppError(error.message,500))
    }
}


exports.createlectures = async(req,res,next) => {
    try {
        const { courseid } = req.params
        const { title, description } = req.body
        if(!title || !description)
        {
            next(new AppError("All fields are required",400))
        }
        const course = await courseModel.findById(courseid)
        if(!course)
        {
            next(new AppError("course not found",400))
        }
        const addlectures = req.body
        course.lecture.push(addlectures)
        await course.save()
        res.status(200).json({
            message:"lectures created"
        }) 
    } catch (error) {
        next(new AppError(error.message,500))
    }
}


