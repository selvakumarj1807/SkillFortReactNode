const AddClasses = require('../../models/masterManagement/addClassModel');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');


exports.getAddClasses = async(req, res, next) => {
    // const resPerPage = 2;
    // const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    const apiFeatures = new APIFeatures(AddClasses.find(), req.query).search().filter();

    const addClass = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: addClass.length,
        addClass
    })
}

exports.newAddClasses = catchAsyncError(async(req, res, next) => {
    const addClass = await AddClasses.create(req.body);
    res.status(201).json({
        success: true,
        addClass
    })
});


exports.updateAddClasses = async(req, res, next) => {
    try {
        let addClass = await AddClasses.findById(req.params.id);

        if (!addClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        addClass = await AddClasses.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            addClass
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


exports.deleteAddClasses = async(req, res, next) => {
    try {
        const addClass = await AddClasses.findByIdAndDelete(req.params.id);

        if (!addClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Class Deleted!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}