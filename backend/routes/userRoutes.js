const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { protect, authorize } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      version: user.tokenVersion 
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '30d',
    }
  );
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'student',
    tokenVersion: 0
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      ...(user.role === 'student' ? { studentDetails: user.studentDetails } : {}),
      ...(user.role === 'tpo' ? { tpoDetails: user.tpoDetails } : {}),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (user.role === 'student' && req.body.studentDetails) {
      user.studentDetails = {
        ...user.studentDetails,
        ...req.body.studentDetails,
      };
    }

    if (user.role === 'tpo' && req.body.tpoDetails) {
      user.tpoDetails = {
        ...user.tpoDetails,
        ...req.body.tpoDetails,
      };
    }

    // Increment token version to invalidate all existing tokens
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      ...(updatedUser.role === 'student' ? { studentDetails: updatedUser.studentDetails } : {}),
      ...(updatedUser.role === 'tpo' ? { tpoDetails: updatedUser.tpoDetails } : {}),
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Logout user (invalidate token)
// @route   POST /api/users/logout
// @access  Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (user) {
    // Increment token version to invalidate current token
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

module.exports = router;