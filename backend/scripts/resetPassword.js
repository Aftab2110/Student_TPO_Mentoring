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

// Function to reset user password
const resetPassword = async () => {
  try {
    // Find the user
    const user = await User.findOne({ email: 'aftab@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Generate a new password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log('Password reset successful');
    console.log('New password: password123');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword(); 