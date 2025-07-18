// server/src/controllers/tenant.controller.js
const { Tenant, TenantLease, User, Room, Property } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all tenants with their active leases and user info
 */
const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.findAll({
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: TenantLease,
          as: 'leases',
          where: { status: 'active' },
          required: false,
          include: [
            { model: Room, as: 'room' },
            { model: Property, as: 'property' }
          ]
        }
      ]
    });
    res.status(200).json({ success: true, data: tenants });
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
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        {
          model: TenantLease,
          as: 'leases',
          required: false,
          include: [
            { model: Room, as: 'room' },
            { model: Property, as: 'property' }
          ]
        }
      ]
    });
    if (!tenant) throw new ApiError(`Tenant with ID ${id} not found`, 404);
    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new tenant
 */
const bcrypt = require('bcryptjs');

const createTenant = async (req, res, next) => {
  try {
    const { name, email, phone, payment_due_day, status, notes, user_id } = req.body;
    let userId = user_id;
    if (!userId) {
      // Create a new user with default password '654321'
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('654321', salt);
      const newUser = await User.create({
        name, email, phone, role: 'tenant', password: hashedPassword
      });
      userId = newUser.id;
    }
    const tenant = await Tenant.create({
      user_id: userId,
      payment_due_day: payment_due_day || 1,
      status: status || 'active',
      notes,
      join_date: new Date()
    });
    res.status(201).json({ success: true, message: 'Tenant created successfully', data: tenant });
  } catch (error) {
    next(error);
  }
};

/**
 * Update tenant info (not leases)
 */
const updateTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_due_day, status, notes } = req.body;
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new ApiError(`Tenant with ID ${id} not found`, 404);
    await tenant.update({ payment_due_day, status, notes });
    res.status(200).json({ success: true, message: 'Tenant updated successfully', data: tenant });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tenant (and cascade delete leases)
 */
const deleteTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new ApiError(`Tenant with ID ${id} not found`, 404);
    await tenant.destroy();
    res.status(200).json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk assign leases to a tenant
 * Expects: { tenant_id, leases: [{ room_id, property_id, lease_start_date, lease_end_date, rent_amount, security_deposit, payment_due_day, status, notes }] }
 */
const assignLeasesToTenant = async (req, res, next) => {
  try {
    const { tenant_id, leases } = req.body;
    if (!tenant_id || !Array.isArray(leases) || leases.length === 0) {
      return res.status(400).json({ success: false, message: 'tenant_id and leases[] are required.' });
    }
    // Ensure tenant exists
    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
    // Validate all rooms and check availability
    for (const lease of leases) {
      const room = await Room.findByPk(lease.room_id);
      if (!room) return res.status(404).json({ success: false, message: `Room with ID ${lease.room_id} not found.` });
      if (room.status !== 'available') {
        return res.status(400).json({ success: false, message: `Room with ID ${lease.room_id} is not available.` });
      }
    }
    // Create leases and update room status
    for (const lease of leases) {
      await TenantLease.create({
        tenant_id,
        room_id: lease.room_id,
        property_id: lease.property_id,
        lease_start_date: lease.lease_start_date,
        lease_end_date: lease.lease_end_date,
        rent_amount: lease.rent_amount,
        security_deposit: lease.security_deposit,
        payment_due_day: lease.payment_due_day,
        status: lease.status || 'active',
        notes: lease.notes || ''
      });
      await Room.update({ status: 'occupied' }, { where: { id: lease.room_id } });
    }
    res.status(200).json({ success: true, message: 'Leases assigned successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  assignLeasesToTenant
};
