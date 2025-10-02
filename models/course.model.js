
const mongoose = require ('mongoose');
const {Schema} = mongoose;

const courseSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        min : 0
    }

});

const course = mongoose.model("course",courseSchema);

module.exports = course;
