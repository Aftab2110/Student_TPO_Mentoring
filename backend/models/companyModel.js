const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a company description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  industry: {
    type: String,
    required: [true, 'Please add an industry']
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: [true, 'Please add company size']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  foundedYear: {
    type: Number,
    required: [true, 'Please add founding year']
  },
  companyDetails: {
    type: {
      about: String,
      benefits: [String],
      culture: [String],
      techStack: [String],
      socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String
      }
    },
    default: {
      about: '',
      benefits: [],
      culture: [],
      techStack: [],
      socialMedia: {
        linkedin: '',
        twitter: '',
        facebook: ''
      }
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match company entered password to hashed password in database
companySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Company', companySchema); 