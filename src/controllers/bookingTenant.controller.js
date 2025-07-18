// server/src/controllers/bookingTenant.controller.js
'use strict';
const { User, Tenant, TenantLease, Room, Property } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Book a room, creating user, tenant, and lease if needed
 * POST /api/book-tenant
 * Body: { name, email, phone, room_id, property_id, lease_start_date, lease_end_date, rent_amount, security_deposit, payment_due_day, notes }
 */
const bookTenant = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      room_id,
      property_id,
      lease_start_date,
      lease_end_date,
      rent_amount,
      security_deposit,
      payment_due_day,
      notes
    } = req.body;

    // 1. Check or create user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('654321', salt);
      user = await User.create({
        name,
        email,
        phone,
        role: 'tenant',
        password: hashedPassword // default password '654321'
      });
    }

    // 2. Create tenant if not exists
    let tenant = await Tenant.findOne({ where: { user_id: user.id } });
    if (!tenant) {
      tenant = await Tenant.create({
        user_id: user.id,
        payment_due_day: payment_due_day || 1,
        status: 'active',
        notes,
        join_date: new Date()
      });
    }

    // 3. Validate room and property
    const room = await Room.findByPk(room_id);
    if (!room) throw new ApiError('Room not found', 404);
    if (room.status !== 'available') throw new ApiError('Room is not available', 400);
    const property = await Property.findByPk(property_id);
    if (!property) throw new ApiError('Property not found', 404);

    // 4. Create tenant lease
    const lease = await TenantLease.create({
      tenant_id: tenant.id,
      room_id,
      property_id,
      lease_start_date,
      lease_end_date,
      rent_amount,
      security_deposit,
      payment_due_day: payment_due_day || 1,
      status: 'pending',
      notes
    });

    // 5. Update room status
    await room.update({ status: 'reserved' });

    res.status(201).json({
      success: true,
      message: 'Booking successful',
      data: { user, tenant, lease }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookTenant
};
