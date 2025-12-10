const express = require('express');
const { getAddClasses, newAddClasses, updateAddClasses, deleteAddClasses } = require('../../controllers/masterManagement/addClassesController');
const router = express.Router();

router.route('/addClasses').get(getAddClasses);
router.route('/addClasses').post(newAddClasses);
router.route('/addClasses/:id').put(updateAddClasses);
router.route('/addClasses/:id').delete(deleteAddClasses);

module.exports = router;