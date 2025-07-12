const { Room, Tenant, TenantLease } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all rooms
 */
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: TenantLease,
          as: 'leases',
          where: { status: 'active' },
          required: false,
          include: [{
            model: Tenant,
            as: 'tenant'
          }]
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
          model: TenantLease,
          as: 'leases',
          required: false,
          include: [
            {
              model: Tenant,
              as: 'tenant'
            }
          ]
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
      image_urls,
      property_id,
      room_category,
      has_tv,
      has_internet,
      has_private_bathroom,
      
      medium_term_price,
      long_term_price,
      
      medium_term_price_with_fooding,
      long_term_price_with_fooding,
      
      breakfast_only_medium_term,
      breakfast_only_long_term,
      
      lunch_only_medium_term,
      lunch_only_long_term,
      
      dinner_only_medium_term,
      dinner_only_long_term,
      
      bf_and_dinner_medium_term,
      bf_and_dinner_long_term,
      
      lunch_and_dinner_medium_term,
      lunch_and_dinner_long_term
    } = req.body;
    
    // Check if room number already exists for the same property
    const existingRoom = await Room.findOne({ where: { room_no, property_id } });
    if (existingRoom) {
      throw new ApiError(`Room with number ${room_no} already exists in this property`, 400);
    }
    
    // Validate property_id is provided
    if (!property_id) {
      throw new ApiError('Property ID is required', 400);
    }

    // Create new room
    const room = await Room.create({
      room_no,
      property_id,
      room_type,
      room_category,
      floor,
      area_sqft,
      base_rent,
      is_furnished,
      has_ac,
      has_balcony,
      has_tv,
      has_internet,
      has_private_bathroom,
      status: status || 'available',
      description,
      image_urls,
      
      medium_term_price,
      long_term_price,
      
      medium_term_price_with_fooding,
      long_term_price_with_fooding,
      
      breakfast_only_medium_term,
      breakfast_only_long_term,
      
      lunch_only_medium_term,
      lunch_only_long_term,
      
      dinner_only_medium_term,
      dinner_only_long_term,
      
      bf_and_dinner_medium_term,
      bf_and_dinner_long_term,
      
      lunch_and_dinner_medium_term,
      lunch_and_dinner_long_term
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
      image_urls,
      property_id,
      room_category,
      has_tv,
      has_internet,
      has_private_bathroom,
      
      medium_term_price,
      long_term_price,
      
      medium_term_price_with_fooding,
      long_term_price_with_fooding,
      
      breakfast_only_medium_term,
      breakfast_only_long_term,
      
      lunch_only_medium_term,
      lunch_only_long_term,
      
      dinner_only_medium_term,
      dinner_only_long_term,
      
      bf_and_dinner_medium_term,
      bf_and_dinner_long_term,
      
      lunch_and_dinner_medium_term,
      lunch_and_dinner_long_term
    } = req.body;
    
    // Find room
    const room = await Room.findByPk(id);
    if (!room) {
      throw new ApiError(`Room with ID ${id} not found`, 404);
    }
    
    // Check if room number already exists in the same property (if changing room_no or property_id)
    const newRoomNo = room_no || room.room_no;
    const newPropertyId = property_id || room.property_id;
    const existingRoom = await Room.findOne({
      where: {
        room_no: newRoomNo,
        property_id: newPropertyId,
        id: { [Room.sequelize.Op.ne]: id }
      }
    });
    if (existingRoom) {
      throw new ApiError(`Room with number ${newRoomNo} already exists in this property`, 400);
    }
    
    // Update room
    await room.update({
      room_no: room_no || room.room_no,
      property_id: property_id || room.property_id,
      room_type: room_type || room.room_type,
      room_category: room_category || room.room_category,
      floor: floor || room.floor,
      area_sqft: area_sqft || room.area_sqft,
      base_rent: base_rent || room.base_rent,
      is_furnished: is_furnished !== undefined ? is_furnished : room.is_furnished,
      has_ac: has_ac !== undefined ? has_ac : room.has_ac,
      has_balcony: has_balcony !== undefined ? has_balcony : room.has_balcony,
      has_tv: has_tv !== undefined ? has_tv : room.has_tv,
      has_internet: has_internet !== undefined ? has_internet : room.has_internet,
      has_private_bathroom: has_private_bathroom !== undefined ? has_private_bathroom : room.has_private_bathroom,
      status: status || room.status,
      description: description || room.description,
      image_urls: image_urls || room.image_urls,
      
      medium_term_price: medium_term_price !== undefined ? medium_term_price : room.medium_term_price,
      long_term_price: long_term_price !== undefined ? long_term_price : room.long_term_price,
      
      medium_term_price_with_fooding: medium_term_price_with_fooding !== undefined ? medium_term_price_with_fooding : room.medium_term_price_with_fooding,
      long_term_price_with_fooding: long_term_price_with_fooding !== undefined ? long_term_price_with_fooding : room.long_term_price_with_fooding,
      
      breakfast_only_medium_term: breakfast_only_medium_term !== undefined ? breakfast_only_medium_term : room.breakfast_only_medium_term,
      breakfast_only_long_term: breakfast_only_long_term !== undefined ? breakfast_only_long_term : room.breakfast_only_long_term,
      
      lunch_only_medium_term: lunch_only_medium_term !== undefined ? lunch_only_medium_term : room.lunch_only_medium_term,
      lunch_only_long_term: lunch_only_long_term !== undefined ? lunch_only_long_term : room.lunch_only_long_term,
      
      dinner_only_medium_term: dinner_only_medium_term !== undefined ? dinner_only_medium_term : room.dinner_only_medium_term,
      dinner_only_long_term: dinner_only_long_term !== undefined ? dinner_only_long_term : room.dinner_only_long_term,
      
      bf_and_dinner_medium_term: bf_and_dinner_medium_term !== undefined ? bf_and_dinner_medium_term : room.bf_and_dinner_medium_term,
      bf_and_dinner_long_term: bf_and_dinner_long_term !== undefined ? bf_and_dinner_long_term : room.bf_and_dinner_long_term,
      
      lunch_and_dinner_medium_term: lunch_and_dinner_medium_term !== undefined ? lunch_and_dinner_medium_term : room.lunch_and_dinner_medium_term,
      lunch_and_dinner_long_term: lunch_and_dinner_long_term !== undefined ? lunch_and_dinner_long_term : room.lunch_and_dinner_long_term
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
          model: TenantLease,
          as: 'leases',
          where: { status: 'active' },
          required: false
        }
      ]
    });
    
    if (!room) {
      throw new ApiError(`Room with ID ${id} not found`, 404);
    }
    
    // Check if room has active leases
    if (room.leases && room.leases.length > 0) {
      throw new ApiError(`Cannot delete room with active tenant lease`, 400);
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

/**
 * Get rooms by property ID
 */
const getRoomsByPropertyId = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    
    if (!propertyId) {
      throw new ApiError('Property ID is required', 400);
    }
    
    const rooms = await Room.findAll({
      where: { property_id: propertyId },
      include: [
        {
          model: TenantLease,
          as: 'leases',
          where: { status: 'active' },
          required: false,
          include: [{
            model: Tenant,
            as: 'tenant'
          }]
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

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getAvailableRooms,
  getRoomsByPropertyId
};