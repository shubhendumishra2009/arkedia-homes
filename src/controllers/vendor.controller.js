const { Vendor, Purchase } = require('../models');
const { Op } = require('sequelize');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all vendors
 */
const getAllVendors = async (req, res, next) => {
  try {
    const { service_type, status, search } = req.query;
    
    const whereConditions = {};
    
    if (service_type) {
      whereConditions.service_type = {
        [Op.in]: Array.isArray(service_type) ? service_type : [service_type]
      };
    }
    
    if (status) {
      whereConditions.status = {
        [Op.in]: Array.isArray(status) ? status : [status]
      };
    }
    
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const vendors = await Vendor.findAll({
      where: whereConditions,
      order: [['name', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get vendor by ID
 */
const getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const vendor = await Vendor.findByPk(id, {
      include: [{
        model: Purchase,
        as: 'purchases'
      }]
    });
    
    if (!vendor) {
      throw new ApiError(`Vendor with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new vendor
 */
const createVendor = async (req, res, next) => {
  try {
    const { 
      name,
      contact_person,
      email,
      phone,
      address,
      service_type,
      payment_terms,
      bank_account_details,
      tax_id,
      status,
      notes
    } = req.body;
    
    // Create new vendor
    const vendor = await Vendor.create({
      name,
      contact_person,
      email,
      phone,
      address,
      service_type: service_type || 'other',
      payment_terms,
      bank_account_details,
      tax_id,
      status: status || 'active',
      notes
    });
    
    res.status(201).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a vendor
 */
const updateVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name,
      contact_person,
      email,
      phone,
      address,
      service_type,
      payment_terms,
      bank_account_details,
      tax_id,
      status,
      notes
    } = req.body;
    
    // Check if vendor exists
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      throw new ApiError(`Vendor with ID ${id} not found`, 404);
    }
    
    // Update vendor
    await vendor.update({
      name,
      contact_person,
      email,
      phone,
      address,
      service_type,
      payment_terms,
      bank_account_details,
      tax_id,
      status,
      notes
    });
    
    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a vendor
 */
const deleteVendor = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if vendor exists
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      throw new ApiError(`Vendor with ID ${id} not found`, 404);
    }
    
    // Delete vendor
    await vendor.destroy();
    
    res.status(200).json({
      success: true,
      message: `Vendor with ID ${id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
};