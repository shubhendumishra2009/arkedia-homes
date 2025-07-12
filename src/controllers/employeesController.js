'use strict';
const { Employee, Property, EmployeeProperty } = require('../models');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{
        model: Property,
        as: 'properties',
        through: { attributes: ['is_primary'] }
      }]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    console.log('Creating employee with data:', JSON.stringify(req.body, null, 2));
    
    // Extract property IDs from request body
    const { propertyIds, primaryPropertyId, ...employeeData } = req.body;
    
    // Create employee
    const employee = await Employee.create(employeeData);
    
    // Associate properties if provided
    if (propertyIds && propertyIds.length > 0) {
      const propertyAssociations = propertyIds.map(propertyId => ({
        employee_id: employee.id,
        property_id: propertyId,
        is_primary: primaryPropertyId && propertyId === parseInt(primaryPropertyId)
      }));
      
      await EmployeeProperty.bulkCreate(propertyAssociations);
      
      // Fetch the employee with properties to return in response
      const employeeWithProperties = await Employee.findByPk(employee.id, {
        include: [{
          model: Property,
          as: 'properties',
          through: { attributes: ['is_primary'] }
        }]
      });
      
      return res.status(201).json(employeeWithProperties);
    }
    
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error.message);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      console.error('Validation errors:', JSON.stringify(validationErrors, null, 2));
      return res.status(400).json({ error: error.message, validationErrors });
    }
    res.status(400).json({ error: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{
        model: Property,
        as: 'properties',
        through: { attributes: ['is_primary'] }
      }]
    });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    console.log('Updating employee with ID:', req.params.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));
    
    // Extract property IDs from request body
    const { propertyIds, primaryPropertyId, ...employeeData } = req.body;
    
    // Update employee data
    const [updated] = await Employee.update(employeeData, {
      where: { id: req.params.id }
    });
    
    if (!updated) return res.status(404).json({ error: 'Employee not found' });
    
    // Update property associations if provided
    if (propertyIds && Array.isArray(propertyIds)) {
      // Remove existing associations
      await EmployeeProperty.destroy({
        where: { employee_id: req.params.id }
      });
      
      // Create new associations
      if (propertyIds.length > 0) {
        const propertyAssociations = propertyIds.map(propertyId => ({
          employee_id: req.params.id,
          property_id: propertyId,
          is_primary: primaryPropertyId && propertyId === parseInt(primaryPropertyId)
        }));
        
        await EmployeeProperty.bulkCreate(propertyAssociations);
      }
    }
    
    // Fetch updated employee with properties
    const updatedEmployee = await Employee.findByPk(req.params.id, {
      include: [{
        model: Property,
        as: 'properties',
        through: { attributes: ['is_primary'] }
      }]
    });
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error.message);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      console.error('Validation errors:', JSON.stringify(validationErrors, null, 2));
      return res.status(400).json({ error: error.message, validationErrors });
    }
    res.status(400).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Employee not found' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPropertiesForEmployeeAssignment = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'location', 'property_type']
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getPropertiesForEmployeeAssignment
};