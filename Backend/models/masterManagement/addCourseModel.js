const { request } = require('express');
const mongoose = require('mongoose');

const AddCourseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: [true, "Pls enter the Course name"],
        trim: true,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

let schema = mongoose.model('AddCourse', AddCourseSchema);

module.exports = schema;