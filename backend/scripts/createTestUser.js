const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to create a test user
const createTestUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('User already exists:', {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      });
      process.exit(0);
    }
    
    // Create new user
    const user = await User.create(userData);
    console.log('User created successfully:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

// Default test user data
const testUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '1234567890',
  role: 'student'
};

// Get user data from command line arguments or use defaults
const userData = {
  name: process.argv[2] || testUserData.name,
  email: process.argv[3] || testUserData.email,
  password: process.argv[4] || testUserData.password,
  phone: process.argv[5] || testUserData.phone,
  role: process.argv[6] || testUserData.role
};

createTestUser(userData); 