const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require("path");


// ✅ Enable CORS for localhost and deployed frontend
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "js")));

const enquiry = require('./routes/enquiry')
const addCourse = require('./routes/masterManagement/addCourse')
const addClasses = require('./routes/masterManagement/addClasses')
const addStudents = require('./routes/masterManagement/addStudents')
const addInterviewStudents = require('./routes/masterManagement/addInterviewStudents')
const candidateInformation = require('./routes/masterManagement/candidateInformation')
const authRoutes = require("./routes/authRoutes");

app.use('/api/v1', enquiry);
app.use('/api/v1/masterManagement', addCourse);
app.use('/api/v1/masterManagement', addClasses);
app.use('/api/v1/masterManagement', addStudents);
app.use('/api/v1/masterManagement', addInterviewStudents);
app.use('/api/v1/masterManagement', candidateInformation);

app.use("/api/auth", authRoutes);

app.use("/api/v1/studentAuth", require("./routes/studentAuthRoutes"));

app.use(errorMiddleware);

module.exports = app; 