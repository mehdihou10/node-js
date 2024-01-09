const mongoose = require('mongoose');

const validator = require('validator');

const {ADMIN,USER,MANAGER} = require('../utils/users.roles');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail,'field must be an email']
        
    },

    password: {
        type: String,
        required: true
    },

    token: {
        type: String
    },

    role: {
        type: String,
        enum: [ADMIN,USER,MANAGER],
        default: USER
    },

    avatar: {
        type: String,
        default: "uploads/user.png"
    }
})

module.exports = mongoose.model('User',userSchema);