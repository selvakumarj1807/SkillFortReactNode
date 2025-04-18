const Enquiry = require('../models/enquiryModel')
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');

//create Enquiry - /api/v1/Enquiry/new
exports.newEnquiry = catchAsyncError(async (req, res, next) => {
    const { mobile, email } = req.body;
  
    // Check for existing mobile or email
    const existingEnquiry = await Enquiry.findOne({
      $or: [{ mobile }, { email }]
    });
  
    if (existingEnquiry) {
      return res.status(400).json({
        success: false,
        message: `Enquiry already exists with ${existingEnquiry.mobile === mobile ? 'mobile' : 'email'}`
      });
    }
  
    // Proceed to create if unique
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({
      success: true,
      enquiry
    });
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

// Get single Enquiry - /api/v1/enquiry/:id
exports.getSingleEnquiry = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let enquiry;
  
    // If valid ObjectId, search by _id or enquiryId
    if (mongoose.Types.ObjectId.isValid(id)) {
      enquiry = await Enquiry.findOne({
        $or: [
          { _id: id },
          { enquiryId: id }
        ]
      });
    } else {
      // Only search by enquiryId
      enquiry = await Enquiry.findOne({ enquiryId: id });
    }
  
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }
  
    res.status(200).json({
      success: true,
      enquiry
    });
  });