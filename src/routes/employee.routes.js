const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// Mock data for development - in a real app, this would use controllers
const mockEmployees = [
  {
    id: 1,
    user: {
      id: 201,
      name: 'Robert Chen',
      email: 'robert.chen@arkediahomes.com',
      phone: '555-111-2222'
    },
    department: 'maintenance',
    position: 'Maintenance Manager',
    hire_date: '2022-03-15',
    salary: 45000,
    emergency_contact: 'Lisa Chen',
    emergency_phone: '555-222-3333',
    status: 'active',
    notes: 'Experienced in plumbing and electrical work'
  },
  {
    id: 2,
    user: {
      id: 202,
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@arkediahomes.com',
      phone: '555-333-4444'
    },
    department: 'housekeeping',
    position: 'Head Housekeeper',
    hire_date: '2022-05-10',
    salary: 38000,
    emergency_contact: 'Carlos Rodriguez',
    emergency_phone: '555-444-5555',
    status: 'active',
    notes: 'Manages cleaning staff schedule'
  },
  {
    id: 3,
    user: {
      id: 203,
      name: 'James Wilson',
      email: 'james.wilson@arkediahomes.com',
      phone: '555-555-6666'
    },
    department: 'security',
    position: 'Security Officer',
    hire_date: '2022-07-22',
    salary: 42000,
    emergency_contact: 'Emma Wilson',
    emergency_phone: '555-666-7777',
    status: 'active',
    notes: 'Night shift (10pm-6am)'
  },
  {
    id: 4,
    user: {
      id: 204,
      name: 'Priya Patel',
      email: 'priya.patel@arkediahomes.com',
      phone: '555-777-8888'
    },
    department: 'management',
    position: 'Assistant Property Manager',
    hire_date: '2022-01-05',
    salary: 52000,
    emergency_contact: 'Raj Patel',
    emergency_phone: '555-888-9999',
    status: 'on_leave',
    notes: 'On maternity leave until October 2023'
  }
];

// Get all employees (admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  // In a real app, this would fetch from database
  res.json({
    success: true,
    data: mockEmployees
  });
});

// Get employee by ID (admin only)
router.get('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const employee = mockEmployees.find(emp => emp.id === id);
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  res.json({
    success: true,
    data: employee
  });
});

// Create new employee (admin only)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  // In a real app, this would validate and save to database
  const newEmployee = {
    id: mockEmployees.length + 1,
    user: {
      id: 200 + mockEmployees.length + 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    },
    department: req.body.department,
    position: req.body.position,
    hire_date: req.body.hire_date,
    salary: req.body.salary,
    emergency_contact: req.body.emergency_contact,
    emergency_phone: req.body.emergency_phone,
    status: req.body.status || 'active',
    notes: req.body.notes || ''
  };
  
  res.status(201).json({
    success: true,
    data: newEmployee,
    message: 'Employee created successfully'
  });
});

// Update employee (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  // In a real app, this would validate and update in database
  const updatedEmployee = {
    ...mockEmployees[employeeIndex],
    user: {
      ...mockEmployees[employeeIndex].user,
      name: req.body.name || mockEmployees[employeeIndex].user.name,
      email: req.body.email || mockEmployees[employeeIndex].user.email,
      phone: req.body.phone || mockEmployees[employeeIndex].user.phone
    },
    department: req.body.department || mockEmployees[employeeIndex].department,
    position: req.body.position || mockEmployees[employeeIndex].position,
    hire_date: req.body.hire_date || mockEmployees[employeeIndex].hire_date,
    salary: req.body.salary || mockEmployees[employeeIndex].salary,
    emergency_contact: req.body.emergency_contact || mockEmployees[employeeIndex].emergency_contact,
    emergency_phone: req.body.emergency_phone || mockEmployees[employeeIndex].emergency_phone,
    status: req.body.status || mockEmployees[employeeIndex].status,
    notes: req.body.notes || mockEmployees[employeeIndex].notes
  };
  
  res.json({
    success: true,
    data: updatedEmployee,
    message: 'Employee updated successfully'
  });
});

// Delete employee (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const employeeIndex = mockEmployees.findIndex(emp => emp.id === id);
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  // In a real app, this would delete from database
  res.json({
    success: true,
    message: 'Employee deleted successfully'
  });
});

module.exports = router;