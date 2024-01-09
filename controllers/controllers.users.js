const User = require('../models/users.schema');
const {SUCCESS,FAIL,ERROR} = require('../utils/http.status.text');
const asyncWrapper = require('../middlewares/asyncWrapper');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/generate.JWT');


function createError(message,status,text){
    const error = new Error();
    error.message = message;
    error.statusCode = status;
    error.statusText = text;

    return error;
}

const getUsers = asyncWrapper( async (req,res,next)=>{

    const users = await User.find({},{password: false,__v:false});
        res.json({status: SUCCESS,data: {users}})

   
})


const register = asyncWrapper(async (req,res,next)=>{

    const {firstName,lastName,email,password,role,avatar} = req.body;


    const oldUser = await User.findOne({email: email});


    if(oldUser){
        return next(createError("email already exists",400,FAIL));
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
        avatar: req.file.filename
    });

    const token = await createToken({email: newUser.email, id: newUser._id,role: newUser.role});
    newUser.token = token;

    await newUser.save();

    res.json({status: SUCCESS,data: {user: newUser}})
})


const login = asyncWrapper(async (req,res,next)=>{

    const {email,password} = req.body;

    if(!email || !password){

        const error = createError(`write ${!email ? 'email' : 'password'}`,400,FAIL);
        return next(error)
    }

    const user = await User.findOne({email: email})

    if(!user){

        const error = createError("user not found",404,FAIL);
        return next(error)

    }

    const userPassword = await bcrypt.compare(password,user.password)

    if(user && userPassword){

        const token = await createToken({email: user.email, id: user._id,role: user.role});

        return res.json({status: SUCCESS,token})

    } else{
        const error = createError("invalid data",500,ERROR);

        return next(error)
    }
})

module.exports = {
    getUsers,
    register,
    login,
}