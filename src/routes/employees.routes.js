'use strict';
const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');

router.get('/', employeesController.getAllEmployees);
router.post('/', employeesController.createEmployee);
router.get('/:id', employeesController.getEmployee);
router.put('/:id', employeesController.updateEmployee);
router.delete('/:id', employeesController.deleteEmployee);

// Route to get properties for employee assignment
router.get('/properties/available', employeesController.getPropertiesForEmployeeAssignment);

module.exports = router;