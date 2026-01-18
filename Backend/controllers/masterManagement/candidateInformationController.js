const CandidateInformation = require("../../models/masterManagement/candidateInformationModel");
const catchAsyncError = require('../../middlewares/catchAsyncError');
const APIFeatures = require('../../utils/apiFeatures');
const mongoose = require("mongoose");

/* ============================
   CREATE CANDIDATE
   POST /api/v1/candidate/new
============================ */
exports.createCandidate = async (req, res) => {
    try {
        const candidateInformation = await CandidateInformation.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Candidate created successfully",
            candidateInformation,
        });

    } catch (error) {

        // ✅ DUPLICATE studentId HANDLING
        if (error.code === 11000 && error.keyPattern?.studentId) {
            return res.status(409).json({
                success: false,
                message: "Student already exists",
            });
        }

        console.error("Create candidate error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


/* ============================
   GET ALL CANDIDATES
   GET /api/v1/candidate
============================ */
exports.getAllCandidates = catchAsyncError(async (req, res) => {
  const apiFeatures = new APIFeatures(
    CandidateInformation.find(),
    req.query
  ).search().filter();

  const candidates = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: candidates.length,
    candidates,
  });
});

/* ============================
   GET SINGLE CANDIDATE
   GET /api/v1/candidate/:id
============================ */
exports.getSingleCandidate = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  let candidate;

  if (mongoose.Types.ObjectId.isValid(id)) {
    candidate = await CandidateInformation.findById(id);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid Candidate ID",
    });
  }

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  res.status(200).json({
    success: true,
    candidate,
  });
});

/* ============================
   UPDATE CANDIDATE
   PUT /api/v1/candidate/:id
============================ */
exports.updateCandidate = catchAsyncError(async (req, res) => {
  const candidate = await CandidateInformation.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  res.status(200).json({
    success: true,
    candidate,
  });
});

/* ============================
   DELETE CANDIDATE
   DELETE /api/v1/candidate/:id
============================ */
exports.deleteCandidate = catchAsyncError(async (req, res) => {
  const candidate = await CandidateInformation.findByIdAndDelete(
    req.params.id
  );

  if (!candidate) {
    return res.status(404).json({
      success: false,
      message: "Candidate not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Candidate deleted successfully",
  });
});
