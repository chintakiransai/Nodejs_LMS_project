const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req,file,cb) =>
    {
        cb(null,'temp1')
    },
    filename : (req,file,cb) =>
    {
        cb(null,file.fieldname)
    }
})

const upload1 = multer({storage:storage})
module.exports =upload1

