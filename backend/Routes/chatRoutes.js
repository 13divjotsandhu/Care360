const express = require('express');
const { getMessagesForUser ,getMessagesByBooking } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get chat history for a specific user (User/Admin)
router.get('/user/:userId', authMiddleware, getMessagesForUser);

// Retrieve messages for a specific booking
router.get('/booking/:bookingId', authMiddleware, getMessagesByBooking);

module.exports = router;