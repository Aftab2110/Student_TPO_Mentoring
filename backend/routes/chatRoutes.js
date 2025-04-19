const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    $or: [
      { student: req.user._id },
      { tpo: req.user._id },
    ],
  })
    .populate('student', 'name email profileImage')
    .populate('tpo', 'name email profileImage')
    .populate('lastMessage')
    .sort('-updatedAt');

  res.json(chats);
}));

// @desc    Create or get one-to-one chat
// @route   POST /api/chat
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId param not sent with request');
  }

  const otherUser = await User.findById(userId);
  if (!otherUser) {
    res.status(404);
    throw new Error('User not found');
  }

  // Determine student and TPO based on roles
  let student, tpo;
  if (req.user.role === 'student' && otherUser.role === 'tpo') {
    student = req.user._id;
    tpo = otherUser._id;
  } else if (req.user.role === 'tpo' && otherUser.role === 'student') {
    student = otherUser._id;
    tpo = req.user._id;
  } else {
    res.status(400);
    throw new Error('Invalid user roles for chat');
  }

  let chat = await Chat.findOne({
    student,
    tpo,
  })
    .populate('student', 'name email profileImage')
    .populate('tpo', 'name email profileImage')
    .populate('messages');

  if (chat) {
    res.json(chat);
  } else {
    chat = await Chat.create({
      student,
      tpo,
      messages: [],
    });

    chat = await Chat.findById(chat._id)
      .populate('student', 'name email profileImage')
      .populate('tpo', 'name email profileImage');

    res.status(201).json(chat);
  }
}));

// @desc    Send message
// @route   POST /api/chat/:chatId/messages
// @access  Private
router.post('/:chatId/messages', protect, asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { chatId } = req.params;

  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Verify user is part of the chat
  if (
    chat.student.toString() !== req.user.id &&
    chat.tpo.toString() !== req.user.id
  ) {
    res.status(401);
    throw new Error('Not authorized to send messages in this chat');
  }

  const message = {
    sender: req.user._id,
    content,
    readBy: [req.user._id],
  };

  chat.messages.push(message);
  chat.lastMessage = message;
  await chat.save();

  // Get the populated message
  const populatedMessage = await Chat.findById(chatId)
    .select('messages')
    .populate('messages.sender', 'name email profileImage')
    .then(chat => chat.messages[chat.messages.length - 1]);

  // Emit socket event for real-time updates
  req.app.get('io').to(chatId).emit('new_message', {
    chat: chatId,
    message: populatedMessage,
  });

  res.status(201).json(populatedMessage);
}));

// @desc    Get chat messages
// @route   GET /api/chat/:chatId/messages
// @access  Private
router.get('/:chatId/messages', protect, asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId)
    .populate('messages.sender', 'name email profileImage')
    .populate('messages.readBy', 'name email');

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Verify user is part of the chat
  if (
    chat.student.toString() !== req.user.id &&
    chat.tpo.toString() !== req.user.id
  ) {
    res.status(401);
    throw new Error('Not authorized to view this chat');
  }

  res.json(chat.messages);
}));

// @desc    Mark messages as read
// @route   PUT /api/chat/:chatId/read
// @access  Private
router.put('/:chatId/read', protect, asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Mark all unread messages as read
  chat.messages.forEach((message) => {
    if (!message.readBy.includes(req.user._id)) {
      message.readBy.push(req.user._id);
    }
  });

  await chat.save();

  res.json({ message: 'Messages marked as read' });
}));

module.exports = router;