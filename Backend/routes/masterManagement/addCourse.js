const express = require('express');
const { getAddCourse, newAddCourse, updateAddCourse, deleteAddCourse, getSingleCourse } = require('../../controllers/masterManagement/addCourseController');
const router = express.Router();

router.route('/addCourse').get(getAddCourse);
router.route('/addCourse/new').post(newAddCourse);
router.route('/addCourse/:id').put(updateAddCourse);
router.route('/addCourse/:id').delete(deleteAddCourse);
router.route('/addCourse/:id').get(getSingleCourse);
module.exports = router;