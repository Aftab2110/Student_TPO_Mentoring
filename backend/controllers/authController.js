const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log('=== Backend Login Debug ===');
    console.log('1. Login request body:', {
      email: req.body.email,
      role: req.body.role
    });

    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    console.log('2. Found user:', user ? {
      _id: user._id,
      email: user.email,
      role: user.role
    } : 'No user found');

    if (!user) {
      console.log('3. User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    console.log('4. Password match:', isMatch);

    if (!isMatch) {
      console.log('5. Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
    console.log('6. Sending response:', response);

    res.json(response);
  } catch (error) {
    console.error('7. Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
}; 