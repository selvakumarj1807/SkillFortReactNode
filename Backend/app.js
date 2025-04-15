const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error');
const cors = require('cors');


// ✅ Enable CORS for all origins
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true
}));

app.use(express.json());

app.use(cookieParser());

const enquiry = require('./routes/enquiry')


app.use('/api/v1', enquiry);

app.use(errorMiddleware);

module.exports = app; 