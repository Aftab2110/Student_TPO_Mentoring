const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Function to check if a user exists
const checkUser = async () => {
  try {
    // Find the user
    const user = await User.findOne({ email: 'aftab@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('User found:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Check password hash
    console.log('Password hash:', user.password);

    // Test password verification
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password match test:', isMatch);

    // Test with a different password
    const wrongPassword = 'wrongpassword';
    const isWrongMatch = await bcrypt.compare(wrongPassword, user.password);
    console.log('Wrong password match test:', isWrongMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser(); 