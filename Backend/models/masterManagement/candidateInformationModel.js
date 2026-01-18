const mongoose = require("mongoose");

/* =========================
   SUB SCHEMAS
========================= */

// Employment Details
const employmentSchema = new mongoose.Schema(
  {
    companyName: String,
    startDate: String,
    endDate: String,
    overallExperience: String,
    employeeId: String,
    dateOfJoining: String,
    lastWorkingDay: String,
  },
  { _id: false }
);

// Education Details
const educationSchema = new mongoose.Schema(
  {
    degree: String,
    department: String,
    collegeName: String,
    startDate: String,
    endDate: String,
    overallDuration: String,
    collegeAddress: String,
    percentage: String,
  },
  { _id: false }
);

// HSC / Diploma Details
const hscDiplomaSchema = new mongoose.Schema(
  {
    schoolName: String,
    address: String,
    startDate: String,
    endDate: String,
    overallDuration: String,
    percentage: String,
  },
  { _id: false }
);

// SSLC Details
const sslcSchema = new mongoose.Schema(
  {
    schoolName: String,
    address: String,
    startDate: String,
    endDate: String,
    overallDuration: String,
    percentage: String,
  },
  { _id: false }
);

// Project Details
const projectSchema = new mongoose.Schema(
  {
    title: String,
    clientName: String,
    clientLocation: String,
    domain: String,
  },
  { _id: false }
);

/* =========================
   MAIN SCHEMA
========================= */

const candidateInformationSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    fullName: { type: String },
    yearsOfExperience: String,

    /* EMPLOYMENT */
    previousEmployment: employmentSchema,
    currentEmployment: employmentSchema,
    noticePeriod: String,
    currentCTC: String,
    expectedCTC: String,

    /* EDUCATION */
    education: [educationSchema],
    hscOrDiploma: hscDiplomaSchema,
    sslc: sslcSchema,

    /* PROJECTS */
    projects: [projectSchema],
    supervisorDetails: String,
    hrDetails: String,

    /* PERSONAL DETAILS */
    fatherName: String,
    fatherOccupation: String,
    motherName: String,
    motherOccupation: String,
    siblingsDetails: String,
    maritalStatus: String,
    email: { type: String },
    mobile: { type: String },
    dob: String,
    age: Number,
    permanentAddress: String,

    /* ID PROOFS */
    panNo: String,
    aadharNo: String,
    studentId: { type: String, unique: true },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CandidateInformation",
  candidateInformationSchema
);
