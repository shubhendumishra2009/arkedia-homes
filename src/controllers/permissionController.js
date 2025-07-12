const db = require('../models');

/**
 * Get user permissions for a specific page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserPermissions = async (req, res) => {
  try {
    const { userId, pageUrl } = req.query;
    
    if (!userId || !pageUrl) {
      return res.status(400).json({
        success: false,
        message: 'User ID and page URL are required'
      });
    }

    // Query to get user permissions for the specified page
    const query = `
      SELECT ufr.has_add_right, ufr.has_update_right, ufr.has_delete_right, ufr.is_active 
      FROM user_form_rights ufr
      JOIN form_master fm ON ufr.form_id = fm.id
      WHERE ufr.user_id = ? AND fm.page_url = ? AND ufr.is_active = TRUE AND fm.is_active = TRUE
    `;

    const permissions = await db.sequelize.query(query, { replacements: [userId, pageUrl], type: db.Sequelize.QueryTypes.SELECT });

    // Check if permissions array is empty or undefined
    if (!permissions || permissions.length === 0) {
      return res.status(200).json({
        success: true,
        has_add_right: false,
        has_update_right: false,
        has_delete_right: false,
        message: 'No permissions found for this user and page'
      });
    }

    // Safely access the first item in the permissions array
    const permission = permissions[0];
    
    return res.status(200).json({
      success: true,
      has_add_right: permission && permission.has_add_right === 1,
      has_update_right: permission && permission.has_update_right === 1,
      has_delete_right: permission && permission.has_delete_right === 1
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
 * Get all forms/pages for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserForms = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Query to get all forms/pages accessible to the user
    const query = `
      SELECT fm.id, fm.page_name, fm.page_url, fm.page_category, fm.description, 
             fm.display_order, fm.parent_id,
             ufr.has_add_right, ufr.has_update_right, ufr.has_delete_right 
      FROM user_form_rights ufr
      JOIN form_master fm ON ufr.form_id = fm.id
      WHERE ufr.user_id = ? AND ufr.is_active = TRUE AND fm.is_active = TRUE
      ORDER BY fm.display_order ASC
    `;

    const forms = await db.sequelize.query(query, { replacements: [userId], type: db.Sequelize.QueryTypes.SELECT });

    // Check if forms is actually an array (Sequelize should guarantee this for SELECT)
    if (!Array.isArray(forms)) {
        console.error('Error: db.sequelize.query did not return an array for SELECT:', forms);
        return res.status(500).json({
            success: false,
            message: 'Internal server error: Unexpected database response format.'
        });
    }
    
    // If no forms found, return empty array instead of error
    if (forms.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: forms.length,
      data: forms.map(form => ({
        id: form.id,
        page_name: form.page_name,
        page_url: form.page_url,
        page_category: form.page_category,
        description: form.description,
        display_order: form.display_order,
        parent_id: form.parent_id,
        has_add_right: form.has_add_right === 1,
        has_update_right: form.has_update_right === 1,
        has_delete_right: form.has_delete_right === 1
      }))
    });
  } catch (error) {
    console.error('Error fetching user forms:', error); // Log the full error
    // Send more detailed error info for debugging (consider removing in production)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user forms',
      error: error.message, // Keep the original message
      details: error.stack // Add stack trace for more context
    });
  }
};