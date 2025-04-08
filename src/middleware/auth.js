const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError } = require('./errorHandler');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401);
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new ApiError('User not found', 401);
    }
    
    if (!user.is_active) {
      throw new ApiError('User account is deactivated', 403);
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      // Check if user exists (should be attached by authenticate middleware)
      if (!req.user) {
        throw new ApiError('Unauthorized', 401);
      }
      
      // Check if user has required role
      if (roles.length && !roles.includes(req.user.role)) {
        throw new ApiError('Forbidden: Insufficient permissions', 403);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize
};