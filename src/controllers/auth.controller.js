const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'tenant' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError('User with this email already exists', 400);
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by model hook
      role: role === 'admin' ? 'tenant' : role, // Prevent creating admin users directly
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data (excluding password)
    const userData = user.toJSON();
    delete userData.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }
    
    // Check if user is active
    if (!user.is_active) {
      throw new ApiError('Your account has been deactivated', 403);
    }
    
    // Verify password
    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid credentials', 401);
    }
    
    // Update last login
    await user.update({ last_login: new Date() });
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data (excluding password)
    const userData = user.toJSON();
    delete userData.password;
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that email doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }
    
    // In a real application, generate a reset token and send email
    // For this example, we'll just acknowledge the request
    
    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    // In a real application, verify the token and find the user
    // For this example, we'll just acknowledge the request
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findByPk(req.user.id);
    
    // Verify current password
    const isMatch = await user.validPassword(currentPassword);
    if (!isMatch) {
      throw new ApiError('Current password is incorrect', 400);
    }
    
    // Update password
    user.password = newPassword; // Will be hashed by model hook
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user (client-side)
 */
const logout = async (req, res, next) => {
  try {
    // JWT tokens are stateless, so logout is handled client-side
    // by removing the token
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
};