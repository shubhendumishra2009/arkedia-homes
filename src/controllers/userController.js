const { User, Employee } = require('../models');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database')[process.env.NODE_ENV || 'development'];
const bcrypt = require('bcryptjs');

// Create a connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Get the current user's ID from the request object (set by auth middleware)
    const currentUserId = req.user ? req.user.id : null;

    // Query to get all users with their associated employee data if available
    // Exclude the currently logged-in user
    const query = `
      SELECT u.*, e.id as employee_id, e.department, e.position, e.is_app_user 
      FROM users u 
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.is_active = TRUE AND u.id != ?
      ORDER BY u.name ASC
    `;


    const [users] = await pool.query(query, [currentUserId]);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Query to get user with their associated employee data if available
    const query = `
      SELECT u.*, e.id as employee_id, e.department, e.position, e.is_app_user 
      FROM users u 
      LEFT JOIN employees e ON u.id = e.user_id
      WHERE u.id = ? AND u.is_active = TRUE
    `;

    const [users] = await pool.query(query, [id]);

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * Create new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, role, employee_id, is_active = true } = req.body;
    
    // Validate required fields
    const validationErrors = [];
    if (!name) validationErrors.push('Name is required');
    if (!email) validationErrors.push('Email is required');
    if (!role) validationErrors.push('Role is required');
    
    // If validation fails, return error
    if (validationErrors.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Check if user with this email already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers && existingUsers.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash the default password (123456)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Insert new user
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, role, is_active]
    );

    const userId = result.insertId;

    // If employee_id is provided, update the employee record with the user_id
    if (employee_id) {
      // Check if employee exists
      const [existingEmployee] = await connection.query(
        'SELECT * FROM employees WHERE id = ?',
        [employee_id]
      );
      
      if (existingEmployee && existingEmployee.length > 0) {
        await connection.query(
          'UPDATE employees SET user_id = ?, is_app_user = TRUE WHERE id = ?',
          [userId, employee_id]
        );
      } else {
        console.warn(`Employee with ID ${employee_id} not found when creating user ${userId}`);
      }
    }

    // If user is an admin, grant all permissions
    if (role === 'admin') {
      // Get all form_master entries
      const [forms] = await connection.query('SELECT id, has_add_right, has_update_right, has_delete_right FROM form_master');
      
      // Insert permissions for each form
      for (const form of forms) {
        await connection.query(
          'INSERT INTO user_form_rights (user_id, form_id, has_add_right, has_update_right, has_delete_right) VALUES (?, ?, ?, ?, ?)',
          [userId, form.id, form.has_add_right, form.has_update_right, form.has_delete_right]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: userId, name, email, role, is_active }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { name, email, role, employee_id, is_active } = req.body;

    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (!existingUsers || existingUsers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already used by another user
    if (email) {
      const [emailUsers] = await connection.query(
        'SELECT * FROM users WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailUsers && emailUsers.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another user'
        });
      }
    }

    // Update user
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }

    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await connection.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // If employee_id is provided, update the employee record
    if (employee_id) {
      // Check if user is already linked to an employee
      const [existingEmployee] = await connection.query(
        'SELECT * FROM employees WHERE user_id = ?',
        [id]
      );

      if (existingEmployee && existingEmployee.length > 0) {
        // If user is already linked to a different employee, update that employee to remove the link
        if (existingEmployee[0].id !== employee_id) {
          await connection.query(
            'UPDATE employees SET user_id = NULL, is_app_user = FALSE WHERE user_id = ?',
            [id]
          );

          // Link to the new employee
          await connection.query(
            'UPDATE employees SET user_id = ?, is_app_user = TRUE WHERE id = ?',
            [id, employee_id]
          );
        }
      } else {
        // Link to the new employee
        await connection.query(
          'UPDATE employees SET user_id = ?, is_app_user = TRUE WHERE id = ?',
          [id, employee_id]
        );
      }
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;

    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (!existingUsers || existingUsers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update any linked employee to remove the user_id
    await connection.query(
      'UPDATE employees SET user_id = NULL, is_app_user = FALSE WHERE user_id = ?',
      [id]
    );

    // Delete user permissions
    await connection.query(
      'DELETE FROM user_form_rights WHERE user_id = ?',
      [id]
    );

    // Delete user
    await connection.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * Get user permissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;

    // Query to get all forms with user permissions
    const query = `
      SELECT 
        fm.id, 
        fm.page_name, 
        fm.page_url, 
        fm.page_category, 
        fm.description,
        fm.has_add_right as default_add,
        fm.has_update_right as default_update,
        fm.has_delete_right as default_delete,
        ufr.has_add_right, 
        ufr.has_update_right, 
        ufr.has_delete_right,
        ufr.is_active
      FROM 
        form_master fm
      LEFT JOIN 
        user_form_rights ufr ON fm.id = ufr.form_id AND ufr.user_id = ?
      WHERE 
        fm.is_active = TRUE
      ORDER BY 
        fm.display_order ASC
    `;

    const [permissions] = await pool.query(query, [id]);

    return res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user permissions',
      error: error.message
    });
  }
};

/**
 * Update user permissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUserPermissions = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { permissions } = req.body;

    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (!existingUsers || existingUsers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete existing permissions
    await connection.query(
      'DELETE FROM user_form_rights WHERE user_id = ?',
      [id]
    );

    // Insert new permissions
    for (const perm of permissions) {
      // Convert null/undefined values to false for permission rights
      const has_add_right = perm.has_add_right === true || perm.has_add_right === 1 ? true : false;
      const has_update_right = perm.has_update_right === true || perm.has_update_right === 1 ? true : false;
      const has_delete_right = perm.has_delete_right === true || perm.has_delete_right === 1 ? true : false;
      const is_active = perm.is_active === false ? false : true; // Default to true if not explicitly false
      
      await connection.query(
        'INSERT INTO user_form_rights (user_id, form_id, has_add_right, has_update_right, has_delete_right, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [id, perm.form_id, has_add_right, has_update_right, has_delete_right, is_active]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'User permissions updated successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating user permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user permissions',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * Get available employees for user assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAvailableEmployees = async (req, res) => {
  try {
    // Query to get employees that can be assigned as users (is_app_user = true)
    const query = `
      SELECT 
        e.id, 
        e.name, 
        e.email, 
        e.department, 
        e.position, 
        e.phone,
        e.address,
        e.is_app_user,
        e.user_id
      FROM 
        employees e
      WHERE 
        e.is_app_user = TRUE AND
        (e.user_id IS NULL OR e.user_id = ?)
      ORDER BY 
        e.name ASC
    `;

    const userId = req.query.userId || null;
    const [employees] = await pool.query(query, [userId]);
    
    // Add a flag to indicate if the employee is already assigned to a user
    employees.forEach(employee => {
      employee.is_assigned = employee.user_id !== null;
    });

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching available employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch available employees',
      error: error.message
    });
  }
};