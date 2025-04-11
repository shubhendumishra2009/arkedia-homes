'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'User account is inactive' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Role-based authorization middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Check if user exists (should be attached by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
    }
    
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};