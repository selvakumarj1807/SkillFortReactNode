const { request } = require('express');
const mongoose = require('mongoose');

const AddStudentSchema = new mongoose.Schema({
    course: { type: String },
    batch_name: { type: String },
    batchStartDate: { type: String },
    batchEndDate: { type: String },
    classTime: { type: String },
    whatsappLink: { type: String },
    studentName: { type: String },
    studentEmail: { type: String },
    studentPhone: { type: String },
    studentDescription: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

let schema = mongoose.model('AddStudent', AddStudentSchema);

module.exports = schema;