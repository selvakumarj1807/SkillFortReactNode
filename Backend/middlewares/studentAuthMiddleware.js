const jwt = require("jsonwebtoken");
const AddStudent = require("../models/masterManagement/addStudentModel");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = await AddStudent.findById(decoded.id).select("-__v");
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }
};
