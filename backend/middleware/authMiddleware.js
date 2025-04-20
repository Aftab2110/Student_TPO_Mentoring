const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Company = require('../models/companyModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }

      // Get company from token
      const company = await Company.findById(decoded.id).select('-password');
      if (company) {
        req.company = company;
        return next();
      }

      throw new Error('Not authorized');
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else if (req.company && roles.includes('company')) {
      next();
    } else {
      res.status(403);
      throw new Error(`Not authorized as ${roles.join(' or ')}`);
    }
  };
};

module.exports = { protect, authorize };