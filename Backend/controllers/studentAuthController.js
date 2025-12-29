const AddStudent = require("../models/masterManagement/addStudentModel");
const generateToken = require("../utils/generateStudentToken");

exports.studentLogin = async (req, res) => {
  try {
    const { studentEmail, studentPhone } = req.body;

    if (!studentEmail || !studentPhone) {
      return res.status(400).json({
        success: false,
        message: "Email and phone are required",
      });
    }

    const student = await AddStudent.findOne({
      studentEmail,
      studentPhone,
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = generateToken(student._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        studentName: student.studentName,
        studentEmail: student.studentEmail,
        studentPhone: student.studentPhone,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
