const app = require("./app");
const env =require('dotenv').config()

app.listen(process.env.port,()=>
{
    console.log("Running Port 8080");
})


const cloudinary = require('cloudinary')
          
cloudinary.config({ 
  cloud_name: 'dkhxhhv5d', 
  api_key: '115926822494289', 
  api_secret: '***************************' 
});