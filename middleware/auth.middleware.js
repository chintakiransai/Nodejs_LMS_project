const jsonwebtoken = require('jsonwebtoken')
const AppError = require("../utils/appError.js")
const isLoggedIn = (req,res,next) => {
    try {
        const getToken = req.cookies.token || null
        if(getToken)
        {
            const playload = jsonwebtoken.verify(getToken,'SECERT')
            if(playload)
            {
                req.user =playload
                next()
            }
            else {
                return next(new AppError("Unauthenicated user, please login p",400))
            }
        }
        else {
            return next(new AppError("Unauthenicated user, please login",400))
        }
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}

const authorizationroles = (...roles) => (req,res,next) => {
    try {
         const currentrole = req.user.role
        if(!roles.includes(currentrole))
          {
            return next(new AppError("Unauthenicated user, Admin can only login",400))
         }
         else{
            next()
         }
      
    } catch (error) {
        return next(new AppError(error.message,500))
    }
}



module.exports = {isLoggedIn
, authorizationroles }