const upload = require("../middleware/upload.middleware.js")
const userModel = require("../schema/user.model.js")
const AppError = require("../util/appError")
const emailValidator = require('email-validator')
const cloudinary = require('cloudinary')

exports.usercreate= async (req,res,next) =>
{
    try {
        const { name,email,password} =req.body
        if(! name || ! email || ! password )
        {
            return next(new AppError("All fields are required",400))
        }

        const userExists = await userModel.findOne({email})

        if(userExists)
        {
            return next(new AppError("User already register",400,"User already exists"))
        }

        if(!emailValidator.validate(email))
        {
            return next(new AppError("Email format is invalid",400))
        }
        const user = await userModel.create({name,email,password, avatar: {
            public_id:"dummy",
            secure_id :"dummy"
        }})

        if(user)
        {
            res.status(200).json({
                success:true,
                message:"User created successfully"
            })
        }
        else {
            return next(new AppError("User failed to register",400))
        }
       
    //    const token = await user.jwtToken()
    //    console.log(token);
    //    const cookieOptions = {
    //     maxAge : 24*60*60*1000,
    //     httpOnly : true
    //    }
    //    res.cookie('token',token,cookieOptions)
    //    res.status(200).json({
    //     message:"sucessfully created cookie"
    //    })
    // avatar: {
    //     public_id:"email",
    //     sucure_id :"email2"
    // }
        if(req.file)
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder :'lms'
            })
            if(result)
            {
                user.avatar.public_id = result.avatar.public_id  
                user.avatar.sucure_id = result.avatar.sucure_id
            }
        } catch (error) {
            return next(new AppError(error.message,500))
        }

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}


exports.userlogin = async (req,res,next) => {
    try {
        const {email, password} = req.body
    if(!email || !password )
    {
        next(new AppError("All fields are required",400))
    }
    const data = await userModel.findOne({email}).select('+password')
    if(!data)
    {
        next(new AppError("email has not register",400))
    }
    
    const userMatch =await data.comparePass(password)
    if(!userMatch || !data)
    {
        next(new AppError("Incorrect password",400))
    }
    else {
        const token =await data.jwtToken()
        const cookieOption = {
            maxAge: 24* 60 * 60 *1000,
            httpOnly:true
        }
        res.cookie("token",token,cookieOption)

        res.status(200).json({
            success:true,
            message:"User login successfully",
            data
           })
    }
    } catch (error) {
            return next(new AppError(error.message,500))
    }
}

exports.userdetails = async (req,res,next) => {
    try {
        const userdetails = req.user.id
        if(!userdetails)
        {
            next(new AppError("user not logged in",400))
        }
        else {
            await userModel.findById(userdetails)
            res.status(200).json({
                message:"User fetched details successfully"
        })
    }
    } catch (error) {
        return next(new AppError(error.message,500))
    }

}

exports.userlogout = (req,res,next) => 
{
    try {
        res.cookie("token",null,0)
        res.status(200).json({
            message:"User logout successfully"
           })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}


exports.userpassupdate = async (req,res,next) => {
    try {
        const { oldpassword, newpassword } =req.body 
        if(!oldpassword || !newpassword )
        {
            next(new AppError("All fields are required",400))
        }
        const { id } =req.user
        const userExists = await userModel.findById(id).select('+password')
        if(!userExists)
        {
            next(new AppError("User doesn't exists",400))
        }
        const isMatch = await userExists.comparePass(oldpassword)
        if(isMatch)
        {
            userExists.password = newpassword
            await userExists.save()
            res.status(200).json({
                message:"User password changed successfully"
               })
        }
        else {
            next(new AppError("Incorrect password",400))
        }

    } catch (error) {
        return next(new AppError(error.message,500))
    }
}