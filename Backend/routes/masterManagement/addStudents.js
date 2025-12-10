const express = require('express');
const { getAddStudent, newAddStudents, updateAddStudent, deleteAddStudent, getSingleStudnet } = require('../../controllers/masterManagement/addStudetController');
const router = express.Router();

router.route('/addStudent').get(getAddStudent);
router.route('/addStudent').post(newAddStudents);
router.route('/addStudent/:id').put(updateAddStudent);
router.route('/addStudent/:id').delete(deleteAddStudent);
router.route('/addStudent/:id').get(getSingleStudnet);
module.exports = router;