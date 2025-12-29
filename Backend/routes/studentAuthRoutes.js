const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/studentAuthMiddleware");
const { studentLogin } = require("../controllers/studentAuthController");

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    student: req.student,
  });
});



router.post("/student-login", studentLogin);

module.exports = router;
