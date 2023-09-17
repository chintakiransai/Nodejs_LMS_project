const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({
    title: {
        type:String,
        unique:true
    },
    description: {
        type:String
    },
    category: {
        type:String
    },
    lecture: [{
        title: String,
        description : String,
    }],
    nummberoflectures :{
        type:Number,
        default:0
    },
    createdby : {
        type:String
    }
})

const courseModel = mongoose.model("Course",courseSchema)
module.exports = courseModel

