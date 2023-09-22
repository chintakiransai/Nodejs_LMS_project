const userModel = require("../schema/user.model.js")
const AppError = require("../utils/appError.js")
const emailValidator = require('email-validator')
const sendEmail = require('../utils/sendEmail.js')

const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

exports.usercreate= async (req,res,next) =>
{
    try {
        const { name,email,password} =req.body
        const avatar = req.file
        if(! name || ! email || ! password)
        {
            return next(new AppError("All fields are required",400))
        }

        const userExists = await userModel.findOne({email})

        if(userExists)
        {
            return next(new AppError("User already register",400,))
        }

        if(!emailValidator.validate(email))
        {
            return next(new AppError("Email format is invalid",400))
        }
        const user = await userModel.create({name,email,password, avatar: 
                    "https://firebasestorage.googleapis.com/v0/b/lms-project-ba70d.appspot.com/o/EmptyProfile.jpg?alt=media&token=493572be-200e-438e-afb9-cfb28070e55a"})
    
        if(!user)
        {
            return next(
                new AppError('User registration failed, please try again later', 400));
        }

        if(avatar)
        {
            const storage = getStorage();
            const storageRef = ref(storage, `Profile/${avatar.originalname}`);
            const metadata = {contentType: 'image/jpeg', };
            await uploadBytes(storageRef, avatar.buffer,metadata)
            const downloadURL = await getDownloadURL(storageRef);
            user.avatar = downloadURL
        }
        
        await user.save();
        
        const token = await user.jwtToken()
        const cookieOption = {
            maxAge: 24* 60 * 60 *1000,
            httpOnly:true
        }
        res.cookie("token",token,cookieOption)
        user.password = undefined
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
        } catch(error) {
            return next(new AppError(error.message,400))
        }
}


exports.userlogin = async (req,res,next) => {
    try {
        const {email, password} = req.body
    if(!email || !password )
    {
        next(new AppError("All fields are required",400))
    }
    const user = await userModel.findOne({email}).select('+password')
    if(!user)
    {
        next(new AppError("email has not register",400))
    }
    
    const userMatch =await user.comparePass(password)
    if(!userMatch || !user)
    {
        next(new AppError("Incorrect password",400))
    }
        await user.save()

        const token =await user.jwtToken()
        const cookieOption = {
            maxAge: 24* 60 * 60 *1000,
            httpOnly:true
        }
        res.cookie("token",token,cookieOption)

        user.password = undefined

        res.status(200).json({
            success:true,
            message:"User login successfully",
            user
           })
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
                success: true,
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
            success: true,
            message:"User logout successfully"
           })
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

exports.forgetPassword = async (req,res,next) => {
    try {
        const {email} = req.body
        if(!email) {
            next(new AppError("Email field is required",400))
        }
        const user = await userModel.findOne({email})
        if(!user) {
            next(new AppError("Email not registered",400))
        }
        const resetToken = await user.generatePasswordResetToken()
        await user.save();
        const frontendUrl="http://localhost:5173"
        const resetPasswordUrl = `${frontendUrl}/reset-password/${resetToken}`
        const subject = "Password Reset"
        const message =`You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`
        await sendEmail(email,subject,message)
        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`,
          });
    } catch (error) {
        // user.forgotPasswordToken = undefined;
        // user.forgotPasswordExpiry = undefined;
        // await user.save();
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
            user.password = undefined
            res.status(200).json({
                success: true,
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