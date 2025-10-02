
const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/user.roles');


const {Schema} = mongoose;

const usersSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validate : [validator.isEmail,'invalid email']
    },
    password : {
        type : String,
        required : true
    },
    token : {
        type : String
    },
    role : {
        type : String,
        enum : [userRoles.ADMIN,userRoles.MANAGER,userRoles.USER],
        default : userRoles.USER
    },
    avatar : {
        type : String,
        default : 'uploads/photo de profil.jpg'
    }
});
 
module.exports = mongoose.model('users',usersSchema);