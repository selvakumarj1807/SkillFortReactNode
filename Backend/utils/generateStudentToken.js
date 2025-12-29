const jwt = require("jsonwebtoken");

const generateToken = (studentId) => {
  return jwt.sign(
    { id: studentId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = generateToken;
