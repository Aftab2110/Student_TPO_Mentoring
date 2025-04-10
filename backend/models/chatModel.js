const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please add a message'],
    },
    messageType: {
      type: String,
      enum: ['text', 'guidance', 'resource', 'feedback'],
      default: 'text'
    },
    metadata: {
      resourceUrl: String,
      resourceType: String,
      feedbackType: {
        type: String,
        enum: ['academic', 'skill', 'career', 'general']
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const chatSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tpo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [messageSchema],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    mentorshipDetails: {
      goals: [String],
      progress: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
      },
      nextMeetingDate: Date,
      meetingNotes: [{
        date: Date,
        notes: String,
        actionItems: [String]
      }]
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', chatSchema);