const mongoose = require('mongoose');
const Counter = require('./counterModel');

const studentEnquirySchema = new mongoose.Schema({
  enquiryId: { type: String },
  name: { type: String },
  dob: { type: Date },
  mobile: { type: String, unique: true },
  email: { type: String, unique: true },
  education: { type: String },
  yearOfPassout: { type: Number },
  percentage: { type: String },
  requiredCourse: { type: String },
  placement: { type: String },
  work: { type: String },
  profession: { type: String },
  company: { type: String },
  designation: { type: String },
  fromDate: { type: String },
  toDate: { type: String },
  pf: { type: String },
  uanNo: { type: String },
  address: { type: String },
  panorAadhar: { type: String },
  referName: { type: String },
  referPhone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate enquiryId like ENQ000001
studentEnquirySchema.pre('save', async function (next) {
  if (this.enquiryId) return next(); // Skip if already set

  const counter = await Counter.findOneAndUpdate(
    { id: 'enquiryId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = counter.seq.toString().padStart(6, '0');
  this.enquiryId = `ENQ${paddedSeq}`;
  next();
});

module.exports = mongoose.model('StudentEnquiry', studentEnquirySchema);
