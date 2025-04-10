const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'tpo'],
      default: 'student',
    },
    profileImage: {
      type: String,
      default: 'default.jpg',
    },
    studentDetails: {
      rollNumber: String,
      branch: String,
      year: Number,
      cgpa: Number,
      skills: [{
        name: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner'
        },
        endorsements: [{
          endorsedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          date: {
            type: Date,
            default: Date.now
          }
        }]
      }],
      resume: String,
      eligibility: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      academicRecords: [{
        semester: Number,
        gpa: Number,
        subjects: [{
          name: String,
          grade: String,
          credits: Number
        }],
        year: Number
      }],
      certifications: [{
        name: String,
        issuer: String,
        date: Date,
        validUntil: Date,
        credentialUrl: String
      }],
      projects: [{
        title: String,
        description: String,
        technologies: [String],
        startDate: Date,
        endDate: Date,
        projectUrl: String
      }],
      mentorshipSessions: [{
        mentor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        date: Date,
        topic: String,
        feedback: String,
        recommendations: [String]
      }]
    },
    tpoDetails: {
      designation: String,
      department: String,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);