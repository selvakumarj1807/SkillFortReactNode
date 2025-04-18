const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error');
const cors = require('cors');


// ✅ Enable CORS for all origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith("http://localhost")) {
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


app.use('/api/v1', enquiry);
app.use('/api/v1/masterManagement', addCourse);


app.use(errorMiddleware);

module.exports = app; 