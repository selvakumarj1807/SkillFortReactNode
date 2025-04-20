const express = require('express');
const { newEnquiry, getEnquiry, getSingleEnquiry, updateEnquiry, deleteEnquiry  } = require('../controllers/enquiryController');
const router = express.Router();

router.route('/enquiry/new').post(newEnquiry);
router.route('/enquiry').get(getEnquiry);
router.route('/enquiry/:id').get(getSingleEnquiry);
router.route('/enquiry/:id').put(updateEnquiry);
router.route('/enquiry/:id').delete(deleteEnquiry);

module.exports = router;