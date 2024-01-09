const asyncWrapper = require('../middlewares/asyncWrapper');

const {validationResult} = require('express-validator');

const Course = require('../models/courses.schema');

const {SUCCESS,FAIL,ERROR} = require('../utils/http.status.text');

function createError(message,status,text){
    const error = new Error();
    error.message = message;
    error.statusCode = status;
    error.statusText = text;

    return error;
}

const getCourses = async (req,res)=>{

    const query = req.query;

    const limit = query.limit;
    const page = query.page;
    const skip = (page - 1) * limit;

    let courses = Course.find({},{"__v": false});

    if(query) courses = await courses.limit(limit).skip(skip);

    else courses = await courses;

    

    res.json({status: SUCCESS,data: {courses}});

};


const addCourse = async (req,res)=>{

    const errors = validationResult(req);

    if(errors.isEmpty()){

        const newCourse = new Course(req.body);

        await newCourse.save();

        res.json({status: SUCCESS,data: {newCourse}});

    } else{
        res.status(400).json({status: FAIL,data: errors.array()})

    }

};

const updateCourse = async (req,res)=>{

    const {courseId} = req.params;

try{
    await Course.findOneAndUpdate({title: courseId},{$set: {...req.body}});

    res.json({msg: "done"})

} catch(err){

    res.status(400).json({error: err})
}
   
    
};


const getCourse = asyncWrapper(
    async (req,res,next)=>{

        const course = await Course.findById(req.params.courseId);

            if(course){
                res.json({status: SUCCESS,data:{course}})

            } else{

                next(createError('course not found',404,FAIL))

            }
    
}
)

const deleteCourse = async (req,res)=>{

    await Course.findByIdAndDelete(req.params.courseId)

    res.json({status: SUCCESS, data: null})
}


module.exports = {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}