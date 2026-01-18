const express = require("express");
const {
    createCandidate,
    getAllCandidates,
    getSingleCandidate,
    updateCandidate,
    deleteCandidate,
} = require("../../controllers/masterManagement/candidateInformationController");

const router = express.Router();

// CREATE
router.post("/candidate/new", createCandidate);

// READ
router.get("/candidate", getAllCandidates);
router.get("/candidate/:id", getSingleCandidate);

// UPDATE
router.put("/candidate/:id", updateCandidate);

// DELETE
router.delete("/candidate/:id", deleteCandidate);

module.exports = router;
