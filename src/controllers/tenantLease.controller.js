// server/src/controllers/tenantLease.controller.js
const { TenantLease, Room } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Update a tenant lease by ID (only if lease is active and not ended)
 */
const updateTenantLease = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lease = await TenantLease.findByPk(id);
    if (!lease) throw new ApiError(`Lease with ID ${id} not found`, 404);
    // Restrict editing if lease is ended
    if (lease.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Only active leases can be edited.' });
    }
    // Optionally: prevent editing if lease_end_date is in the past
    const now = new Date();
    if (lease.lease_end_date && new Date(lease.lease_end_date) < now) {
      return res.status(400).json({ success: false, message: 'Cannot edit leases that have already ended.' });
    }
    const allowedFields = [
      'lease_start_date', 'lease_end_date', 'rent_amount', 'security_deposit', 'payment_due_day', 'status', 'notes'
    ];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    await lease.update(updates);
    res.status(200).json({ success: true, message: 'Lease updated successfully', data: lease });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a tenant lease by ID (only if lease is active and not ended)
 */
const deleteTenantLease = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lease = await TenantLease.findByPk(id);
    if (!lease) throw new ApiError(`Lease with ID ${id} not found`, 404);
    // Restrict deletion if lease is ended
    if (lease.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Only active leases can be deleted.' });
    }
    // Optionally: prevent deleting if lease_end_date is in the past
    const now = new Date();
    if (lease.lease_end_date && new Date(lease.lease_end_date) < now) {
      return res.status(400).json({ success: false, message: 'Cannot delete leases that have already ended.' });
    }
    // Free up the room
    await Room.update({ status: 'available' }, { where: { id: lease.room_id } });
    await lease.destroy();
    res.status(200).json({ success: true, message: 'Lease deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateTenantLease,
  deleteTenantLease
};
