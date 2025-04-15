const Enquiry = require('../models/enquiryModel')
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

//create Enquiry - /api/v1/Enquiry/new
exports.newEnquiry = catchAsyncError(async (req, res, next) => {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({
        success: true,
        enquiry
    })
});

//get Enquiry - /api/v1/Enquiry
exports.getEnquiry = async (req, res, next) => {
    // const resPerPage = 2;
    // const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    const apiFeatures = new APIFeatures(Enquiry.find(), req.query).search().filter();

    const enquiry = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: enquiry.length,
        enquiry
    })
}