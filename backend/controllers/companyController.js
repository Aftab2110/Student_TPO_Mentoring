const Company = require('../models/companyModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new company
// @route   POST /api/companies/register
// @access  Public
exports.registerCompany = async (req, res) => {
  try {
    console.log('Received company registration request:', req.body);
    
    const {
      name,
      email,
      password,
      phone,
      website,
      description,
      industry,
      size,
      location,
      foundedYear,
    } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'phone', 'description', 'industry', 'size', 'location', 'foundedYear'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Validate website format if provided
    if (website && !website.match(/^https?:\/\//)) {
      website = `https://${website}`;
    }

    // Check if company exists
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      console.log('Company already exists with email:', email);
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Create company
    const company = await Company.create({
      name,
      email,
      password,
      phone,
      website,
      description,
      industry,
      size,
      location,
      foundedYear,
      status: 'active' // Set initial status as active
    });

    if (company) {
      console.log('Company created successfully:', company._id);
      res.status(201).json({
        _id: company._id,
        name: company.name,
        email: company.email,
        role: 'company',
        token: generateToken(company._id),
      });
    } else {
      console.error('Failed to create company');
      res.status(400).json({ message: 'Invalid company data' });
    }
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ 
      message: 'Error registering company',
      error: error.message 
    });
  }
};

// @desc    Auth company & get token
// @route   POST /api/companies/login
// @access  Public
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for company email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await company.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if company is active
    if (company.status !== 'active') {
      return res.status(401).json({ message: 'Company account is not active. Please contact support.' });
    }

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      role: 'company',
      token: generateToken(company._id),
      status: company.status
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company profile
// @route   GET /api/companies/profile
// @access  Private
exports.getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select('-password');
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private
exports.updateCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id);

    if (company) {
      company.name = req.body.name || company.name;
      company.email = req.body.email || company.email;
      company.phone = req.body.phone || company.phone;
      company.website = req.body.website || company.website;
      company.description = req.body.description || company.description;
      company.industry = req.body.industry || company.industry;
      company.size = req.body.size || company.size;
      company.location = req.body.location || company.location;
      company.foundedYear = req.body.foundedYear || company.foundedYear;

      if (req.body.password) {
        company.password = req.body.password;
      }

      const updatedCompany = await company.save();

      res.json({
        _id: updatedCompany._id,
        name: updatedCompany.name,
        email: updatedCompany.email,
        token: generateToken(updatedCompany._id),
      });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company dashboard data
// @route   GET /api/companies/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get total jobs posted
    const totalJobs = await Job.countDocuments({ company: company._id });

    // Get total applications received
    const totalApplications = await Application.countDocuments({
      job: { $in: await Job.find({ company: company._id }).select('_id') }
    });

    // Get recent applications
    const recentApplications = await Application.find({
      job: { $in: await Job.find({ company: company._id }).select('_id') }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'name email')
      .populate('job', 'title');

    // Get recent jobs
    const recentJobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalJobs,
      totalApplications,
      recentApplications,
      recentJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCompany: exports.registerCompany,
  loginCompany: exports.loginCompany,
  getCompanyProfile: exports.getCompanyProfile,
  updateCompanyProfile: exports.updateCompanyProfile,
  getDashboardData: exports.getDashboardData
}; 