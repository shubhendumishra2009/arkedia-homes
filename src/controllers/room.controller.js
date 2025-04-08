const { Room, Tenant } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all rooms
 */
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: Tenant,
          as: 'tenant',
          required: false
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get room by ID
 */
const getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findByPk(id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          required: false
        }
      ]
    });
    
    if (!room) {
      throw new ApiError(`Room with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new room
 */
const createRoom = async (req, res, next) => {
  try {
    const { 
      room_no, 
      room_type, 
      floor, 
      area_sqft, 
      base_rent, 
      is_furnished, 
      has_ac, 
      has_balcony, 
      status, 
      description, 
      image_urls 
    } = req.body;
    
    // Check if room number already exists
    const existingRoom = await Room.findOne({ where: { room_no } });
    if (existingRoom) {
      throw new ApiError(`Room with number ${room_no} already exists`, 400);
    }
    
    // Create new room
    const room = await Room.create({
      room_no,
      room_type,
      floor,
      area_sqft,
      base_rent,
      is_furnished,
      has_ac,
      has_balcony,
      status: status || 'available',
      description,
      image_urls
    });
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a room
 */
const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      room_no, 
      room_type, 
      floor, 
      area_sqft, 
      base_rent, 
      is_furnished, 
      has_ac, 
      has_balcony, 
      status, 
      description, 
      image_urls 
    } = req.body;
    
    // Find room
    const room = await Room.findByPk(id);
    if (!room) {
      throw new ApiError(`Room with ID ${id} not found`, 404);
    }
    
    // Check if room number already exists (if changing room number)
    if (room_no && room_no !== room.room_no) {
      const existingRoom = await Room.findOne({ where: { room_no } });
      if (existingRoom) {
        throw new ApiError(`Room with number ${room_no} already exists`, 400);
      }
    }
    
    // Update room
    await room.update({
      room_no: room_no || room.room_no,
      room_type: room_type || room.room_type,
      floor: floor || room.floor,
      area_sqft: area_sqft || room.area_sqft,
      base_rent: base_rent || room.base_rent,
      is_furnished: is_furnished !== undefined ? is_furnished : room.is_furnished,
      has_ac: has_ac !== undefined ? has_ac : room.has_ac,
      has_balcony: has_balcony !== undefined ? has_balcony : room.has_balcony,
      status: status || room.status,
      description: description || room.description,
      image_urls: image_urls || room.image_urls
    });
    
    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a room
 */
const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find room
    const room = await Room.findByPk(id, {
      include: [
        {
          model: Tenant,
          as: 'tenant',
          required: false
        }
      ]
    });
    
    if (!room) {
      throw new ApiError(`Room with ID ${id} not found`, 404);
    }
    
    // Check if room has tenants
    if (room.tenant) {
      throw new ApiError(`Cannot delete room with active tenant`, 400);
    }
    
    // Delete room
    await room.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available rooms
 */
const getAvailableRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      where: { status: 'available' }
    });
    
    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms
};