const AddStudent = require('../../models/masterManagement/addStudentModel');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');


exports.getAddStudent = async(req, res, next) => {
    // const resPerPage = 2;
    // const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    const apiFeatures = new APIFeatures(AddStudent.find(), req.query).search().filter();

    const addStudent = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: addStudent.length,
        addStudent
    })
}

exports.newAddStudents = catchAsyncError(async(req, res, next) => {
    const addStudent = await AddStudent.create(req.body);
    res.status(201).json({
        success: true,
        addStudent
    })
});


exports.updateAddStudent = async(req, res, next) => {
    try {
        let addStudent = await AddStudent.findById(req.params.id);

        if (!addStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        addStudent = await AddStudent.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            addStudent
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


exports.deleteAddStudent = async(req, res, next) => {
    try {
        const addStudent = await AddStudent.findByIdAndDelete(req.params.id);

        if (!addStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student Deleted!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

const mongoose = require('mongoose');

exports.getSingleStudnet = async (req, res, next) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return next(new ErrorHandler(`Resource not found: ${req.params.id}`, 400));
        }

        const addStudent = await AddStudent.findById(req.params.id);

        if (!addStudent) {
            return next(new ErrorHandler('Student not found', 404));
        }

        res.status(200).json({
            success: true,
            addStudent
        });
    } catch (err) {
        next(err);
    }
};