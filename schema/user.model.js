const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:[true,"name is needed"]
    },
    email: {
        type:String,
        required:[true,"email is needed"],
        // trim:true,
        // lowercase:true
    },
    password: {
        type:String,
        required:[true,"password is needed"]
    },
    avatar: {
        public_id :
        {
            type:String
        },
        secure_id : {
            type:String
        }
    },
    role: {
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }
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
    }
}


const userModel = mongoose.model('User',userSchema)
module.exports=userModel