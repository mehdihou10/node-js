
const express = require('express');
const router = express.Router();

function createError(message,status,text){
    const error = new Error();
    error.message = message;
    error.statusCode = status;
    error.statusText = text;

    return error;
}

const multer = require('multer');

const diskStorage = multer.diskStorage({

    destination: function(req,file,cb){

        cb(null,'uploads')
    },
    filename: function(req,file,cb){

        const ext = file.mimetype.split('/')[1];

        const fileName = `user-${Date.now()}.${ext}`;
        cb(null,fileName)
    }
})

const fileFilter = (req,file,cb)=>{

    const fileType = file.mimetype.split('/')[0];

    if(fileType === 'image'){

        return cb(null,true);

    } else{

        return cb(createError('invalid type',400),false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
});


const {getUsers,register,login} = require('../controllers/controllers.users');

const verifyToken = require('../middlewares/verify.token');
const { create } = require('lodash');

//routes
router.route('/')
.get(verifyToken,getUsers);

router.route('/register')
.post(upload.single('avatar'),register);

router.route('/login')
.post(login)

module.exports = router;