const express = require('express');
const dbToConnect = require('./config/db');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const courseRoutes = require('./routes/course.routes');
const errorMiddleware = require('./middleware/error.middleware');
const app = express();
const cors = require("cors")

dbToConnect()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/user',userRoutes)
app.use('/course',courseRoutes)
app.all('*',(req,res)=> {
    res.status(400).json({
        message:`can't find ${req.originalUrl}`
    })
})

app.use(errorMiddleware)

module.exports =app