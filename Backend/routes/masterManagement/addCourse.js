const express = require('express');
const { getAddCourse, newAddCourse, updateAddCourse, deleteAddCourse } = require('../../controllers/masterManagement/addCourseController');
const router = express.Router();

router.route('/addCourse').get(getAddCourse);
router.route('/addCourse/new').post(newAddCourse);
router.route('/addCourse/:id').put(updateAddCourse);
router.route('/addCourse/:id').delete(deleteAddCourse);

module.exports = router;