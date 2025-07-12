const { Property, Room } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all properties
 */
const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.findAll({
      include: [
        {
          model: Room,
          as: 'rooms',
          required: false
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: properties
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get property by ID
 */
const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findByPk(id, {
      include: [
        {
          model: Room,
          as: 'rooms',
          required: false
        }
      ]
    });
    
    if (!property) {
      throw new ApiError(`Property with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new property
 */
const createProperty = async (req, res, next) => {
  try {
    const { 
      name, 
      location, 
      address, 
      description, 
      property_type, 
      total_rooms, 
      amenities, 
      image_urls, 
      status 
    } = req.body;
    
    // Create new property
    const property = await Property.create({
      name,
      location,
      address,
      description,
      property_type: property_type || 'apartment',
      total_rooms: total_rooms || 0,
      amenities,
      image_urls,
      status: status || 'active'
    });
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a property
 */
const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      location, 
      address, 
      description, 
      property_type, 
      total_rooms, 
      amenities, 
      image_urls, 
      status 
    } = req.body;
    
    // Check if property exists
    const property = await Property.findByPk(id);
    if (!property) {
      throw new ApiError(`Property with ID ${id} not found`, 404);
    }
    
    // Update property
    await property.update({
      name,
      location,
      address,
      description,
      property_type,
      total_rooms,
      amenities,
      image_urls,
      status
    });
    
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a property
 */
const deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if property exists
    const property = await Property.findByPk(id);
    if (!property) {
      throw new ApiError(`Property with ID ${id} not found`, 404);
    }
    
    // Delete property
    await property.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
};