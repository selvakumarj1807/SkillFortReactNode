const express = require('express');
const { getAddStudent, newAddStudents, updateAddStudent, deleteAddStudent, getSingleStudnet } = require('../../controllers/masterManagement/addInterviewStudetController.js');
const router = express.Router();

router.route('/addInterviewStudents').get(getAddStudent);
router.route('/addInterviewStudents').post(newAddStudents);
router.route('/addInterviewStudents/:id').put(updateAddStudent);
router.route('/addInterviewStudents/:id').delete(deleteAddStudent);
router.route('/addInterviewStudents/:id').get(getSingleStudnet);
module.exports = router;