const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Job'
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  resume: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 