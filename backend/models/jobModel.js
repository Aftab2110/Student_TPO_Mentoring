const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please add company name'],
    },
    position: {
      type: String,
      required: [true, 'Please add job position'],
    },
    description: {
      type: String,
      required: [true, 'Please add job description'],
    },
    requirements: {
      type: [String],
      required: [true, 'Please add job requirements'],
    },
    location: {
      type: String,
      required: [true, 'Please add job location'],
    },
    salary: {
      type: String,
      required: [true, 'Please add salary range'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship'],
      required: true,
    },
    eligibilityCriteria: {
      minCGPA: {
        type: Number,
        required: true,
      },
      branches: {
        type: [String],
        required: true,
      },
      requiredSkills: [String],
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'shortlisted', 'rejected'],
          default: 'pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);