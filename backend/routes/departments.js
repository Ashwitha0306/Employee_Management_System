// backend/routes/departmentRoutes.js
const express = require('express');
const router = express.Router();
const deptCtrl = require('../controllers/departmentController');

router.get('/', deptCtrl.getAllDepartments);
router.post('/', deptCtrl.createDepartment);
router.put('/:id', deptCtrl.updateDepartment);
router.delete('/:id', deptCtrl.deleteDepartment);

module.exports = router;
