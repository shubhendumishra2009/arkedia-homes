const { User, Tenant, Room } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all tenants
 */
const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: tenants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tenant by ID
 */
const getTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tenant = await Tenant.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });
    
    if (!tenant) {
      throw new ApiError(`Tenant with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new tenant
 */
const createTenant = async (req, res, next) => {
  try {
    const { 
      user_id, 
      room_no, 
      rent_amount, 
      security_deposit, 
      lease_start, 
      lease_end, 
      payment_due_day,
      notes 
    } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new ApiError(`User with ID ${user_id} not found`, 404);
    }
    
    // Check if user is already a tenant
    const existingTenant = await Tenant.findOne({ where: { user_id } });
    if (existingTenant) {
      throw new ApiError(`User with ID ${user_id} is already a tenant`, 400);
    }
    
    // Check if room exists and is available
    const room = await Room.findOne({ where: { room_no } });
    if (!room) {
      throw new ApiError(`Room with number ${room_no} not found`, 404);
    }
    
    if (room.status !== 'available') {
      throw new ApiError(`Room with number ${room_no} is not available`, 400);
    }
    
    // Create new tenant
    const tenant = await Tenant.create({
      user_id,
      room_no,
      rent_amount,
      security_deposit,
      lease_start,
      lease_end,
      payment_due_day: payment_due_day || 1,
      notes
    });
    
    // Update room status
    await room.update({ status: 'occupied' });
    
    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update tenant
 */
const updateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      room_no, 
      rent_amount, 
      security_deposit, 
      lease_start, 
      lease_end, 
      payment_due_day,
      status,
      notes 
    } = req.body;
    
    // Find tenant
    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      throw new ApiError(`Tenant with ID ${id} not found`, 404);
    }
    
    // If room is changing, check if new room exists and is available
    if (room_no && room_no !== tenant.room_no) {
      const newRoom = await Room.findOne({ where: { room_no } });
      if (!newRoom) {
        throw new ApiError(`Room with number ${room_no} not found`, 404);
      }
      
      if (newRoom.status !== 'available') {
        throw new ApiError(`Room with number ${room_no} is not available`, 400);
      }
      
      // Free up old room
      const oldRoom = await Room.findOne({ where: { room_no: tenant.room_no } });
      if (oldRoom) {
        await oldRoom.update({ status: 'available' });
      }
      
      // Update new room status
      await newRoom.update({ status: 'occupied' });
    }
    
    // Update tenant
    await tenant.update({
      room_no: room_no || tenant.room_no,
      rent_amount: rent_amount || tenant.rent_amount,
      security_deposit: security_deposit || tenant.security_deposit,
      lease_start: lease_start || tenant.lease_start,
      lease_end: lease_end || tenant.lease_end,
      payment_due_day: payment_due_day || tenant.payment_due_day,
      status: status || tenant.status,
      notes: notes || tenant.notes
    });
    
    res.status(200).json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tenant
 */
const deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find tenant
    const tenant = await Tenant.findByPk(id);
    if (!tenant) {
      throw new ApiError(`Tenant with ID ${id} not found`, 404);
    }
    
    // Free up room
    const room = await Room.findOne({ where: { room_no: tenant.room_no } });
    if (room) {
      await room.update({ status: 'available' });
    }
    
    // Delete tenant
    await tenant.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant
};