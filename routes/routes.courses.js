
const express = require('express');
const router = express.Router();

const {body} = require('express-validator');


const {getCourses,getCourse,addCourse,updateCourse, deleteCourse} = require('../controllers/controllers.courses');

const verifyToken = require('../middlewares/verify.token');

const verifyRole = require('../middlewares/verify.role');

const role = require('../utils/users.roles');


router.route('/')
.get(getCourses)

.post(

    verifyToken,

    [
        body("title")
        .notEmpty().withMessage("add a  title!")
        .isLength({min: 2,max: 10}).withMessage("write a valid course title"),
        
        body('price')
        .notEmpty().withMessage('write a price')
        .isNumeric().withMessage('price must me a number')
    ],

addCourse);

router.route('/:courseId')
.patch(updateCourse)
.get(getCourse)
.delete(verifyToken,verifyRole(role.ADMIN,role.MANAGER),deleteCourse)



module.exports = router;