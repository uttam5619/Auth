const multer = require('multer');
const path = require('path');

const upload= multer({
    dest: 'uploads/',
    limits: {fileSize:25*1024*1024},

    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) =>{
            cb(null, file.originalname)
        }
    }),

    fileFilter:(req, file, cb) =>{
        const extension = path.extname(file.originalname)
        if(extension !=='.jpg' && extension !=='.jpeg' && extension !=='.png' && extension !=='.webp'){
            cb(null,false)
            return
        }
        cb(null, true)
    }

})

module.exports = upload