const { Purchase } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all purchases
 */
const getAllPurchases = async (req, res, next) => {
  try {
    const { month, year, category, priority, ordered, status } = req.query;
    // Validate numeric parameters
    const numericMonth = month ? parseInt(month) : null;
    const numericYear = year ? parseInt(year) : null;

    const whereConditions = {};

    if (numericMonth && numericYear) {
      whereConditions.purchase_date = {
        [Op.and]: [
          sequelize.where(sequelize.fn('MONTH', sequelize.col('purchase_date')), numericMonth),
          sequelize.where(sequelize.fn('YEAR', sequelize.col('purchase_date')), numericYear)
        ]
      };
    }

    if (category) {
      whereConditions.category = category;
    }

    if (priority) {
      whereConditions.priority = {
        [Op.in]: Array.isArray(priority) ? priority : [priority]
      };
    }
    if (status) {
      whereConditions.status = {
        [Op.in]: Array.isArray(status) ? status : [status]
      };
    }

    const purchases = await Purchase.findAll({
      where: whereConditions,
      order: [
        ['purchase_date', ordered === 'asc' ? 'ASC' : 'DESC'],
        ['priority', 'ASC']
      ]
    });
    
    res.status(200).json({
      success: true,
      data: purchases
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get purchase by ID
 */
const getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const purchase = await Purchase.findByPk(id);
    
    if (!purchase) {
      throw new ApiError(`Purchase with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: purchase
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new purchase
 */
const createPurchase = async (req, res, next) => {
  try {
    const { 
      item_name,
      vendor,
      amount,
      purchase_date,
      category,
      payment_method,
      invoice_number,
      status,
      priority,
      notes
    } = req.body;
    
    // Create new purchase
    const purchase = await Purchase.create({
      item_name,
      vendor,
      amount,
      purchase_date,
      category,
      payment_method,
      invoice_number,
      status: status || 'completed',
      priority: priority || 'medium',
      notes
    });
    
    res.status(201).json({
      success: true,
      data: purchase
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a purchase
 */
const updatePurchase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      item_name,
      vendor,
      amount,
      purchase_date,
      category,
      payment_method,
      invoice_number,
      status,
      priority,
      notes
    } = req.body;
    
    // Check if purchase exists
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      throw new ApiError(`Purchase with ID ${id} not found`, 404);
    }
    
    // Update purchase
    await purchase.update({
      item_name,
      vendor,
      amount,
      purchase_date,
      category,
      payment_method,
      invoice_number,
      status,
      priority,
      notes
    });
    
    res.status(200).json({
      success: true,
      data: purchase
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a purchase
 */
const deletePurchase = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if purchase exists
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      throw new ApiError(`Purchase with ID ${id} not found`, 404);
    }
    
    // Delete purchase
    await purchase.destroy();
    
    res.status(200).json({
      success: true,
      message: `Purchase with ID ${id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase
};