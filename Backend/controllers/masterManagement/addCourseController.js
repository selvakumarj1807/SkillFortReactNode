const AddCourse = require('../../models/masterManagement/addCourseModel');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');


exports.getAddCourse = async(req, res, next) => {
    // const resPerPage = 2;
    // const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    const apiFeatures = new APIFeatures(AddCourse.find(), req.query).search().filter();

    const addCourse = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: addCourse.length,
        addCourse
    })
}

exports.newAddCourse = catchAsyncError(async(req, res, next) => {
    const addCourse = await AddCourse.create(req.body);
    res.status(201).json({
        success: true,
        addCourse
    })
});


exports.updateAddCourse = async(req, res, next) => {
    try {
        let addCourse = await AddCourse.findById(req.params.id);

        if (!addCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        addCourse = await AddCourse.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            addCourse
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


exports.deleteAddCourse = async(req, res, next) => {
    try {
        const addCourse = await AddCourse.findByIdAndDelete(req.params.id);

        if (!addCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course Deleted!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

const mongoose = require('mongoose');

exports.getSingleCourse = async (req, res, next) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return next(new ErrorHandler(`Resource not found: ${req.params.id}`, 400));
        }

        const addCourse = await AddCourse.findById(req.params.id);

        if (!addCourse) {
            return next(new ErrorHandler('Corse not found', 404));
        }

        res.status(200).json({
            success: true,
            addCourse
        });
    } catch (err) {
        next(err);
    }
};