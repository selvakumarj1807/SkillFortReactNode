const { request } = require('express');
const mongoose = require('mongoose');

const AddInterviewStudentSchema = new mongoose.Schema({
    studentName: { type: String },
    studentEmail: { type: String },
    studentPhone: { type: String },
    studentDescription: { type: String },
    techStack: { type: String },
    followUp: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let schema = mongoose.model('AddInterviewStudent', AddInterviewStudentSchema);

module.exports = schema;