const express = require('express');
const { newEnquiry, getEnquiry, getSingleEnquiry  } = require('../controllers/enquiryController');
const router = express.Router();

router.route('/enquiry/new').post(newEnquiry);
router.route('/enquiry').get(getEnquiry);
router.route('/enquiry/:id').get(getSingleEnquiry);

module.exports = router;