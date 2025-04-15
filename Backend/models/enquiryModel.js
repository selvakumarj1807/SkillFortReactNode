const mongoose = require('mongoose');

const studentEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  education: { type: String },
  yearOfPassout: { type: Number },
  percentage: { type: String },
  requiredCourse: { type: String },
  placement: { type: String }, // yes or no
  work: { type: String }, // yes or no
  profession: { type: String }, // IT or Non-IT
  company: { type: String },
  designation: { type: String },
  fromDate: { type: String },
  toDate: { type: String },
  pf: { type: String }, // yes or no
  uanNo: { type: String },
  address: { type: String },
  panorAadhar: { type: String },
  referName: { type: String },
  referPhone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentEnquiry', studentEnquirySchema);
