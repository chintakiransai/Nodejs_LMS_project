const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [5, 'Name must be at least 5 characters'],
        lowercase: true,
        trim: true, // Removes unnecessary spaces
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false, // Will not select password upon looking up a document
    },
    avatar: {
        type: String,
    },
    role: {
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
},
{
    timestamps:true
}
)

userSchema.pre('save', async function (next)
{
    if(!this.isModified('password'))
    {
       return next()
    }
    this.password = await bcrypt.hash(this.password,10)
    return next()
})


userSchema.methods = {
    jwtToken()  {
        return jwt.sign({id:this._id,name:this.name,email:this.email,role:this.role},'SECERT',{expiresIn:'24h'})
    },
    comparePass: async function (plainpassword) {
    return await bcrypt.compare(plainpassword,this.password)
    },
    
}



const userModel = mongoose.model('User',userSchema)
module.exports=userModel