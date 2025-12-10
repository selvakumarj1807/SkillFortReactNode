const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error');
const cors = require('cors');


// ✅ Enable CORS for localhost and deployed frontend
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://skill-fort-react-node.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json());

app.use(cookieParser());

const enquiry = require('./routes/enquiry')
const addCourse = require('./routes/masterManagement/addCourse')
const addClasses = require('./routes/masterManagement/addClasses')
const addStudents = require('./routes/masterManagement/addStudents')
const authRoutes = require("./routes/authRoutes");

app.use('/api/v1', enquiry);
app.use('/api/v1/masterManagement', addCourse);
app.use('/api/v1/masterManagement', addClasses);
app.use('/api/v1/masterManagement', addStudents);

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

module.exports = app; 