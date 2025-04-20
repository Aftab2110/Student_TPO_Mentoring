const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/userModel');

const fixPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

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

    // Generate a new password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Update the user's password directly in the database
    // This bypasses the pre-save middleware
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    console.log('Password updated successfully');
    console.log('New password: password123');
    
    // Verify the password
    const updatedUser = await User.findById(user._id);
    const isMatch = await bcrypt.compare('password123', updatedUser.password);
    console.log('Password verification test:', isMatch);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPassword(); 