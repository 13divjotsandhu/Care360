const Message = require('../models/Message');
const User = require('../models/User');
const Booking = require('../models/Booking');

const getMessagesForUser = async (req, res) => {
  const { userId } = req.params;     //get user id from url
try {
  // Retrieve all messages where user is sender or receiver
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .populate('bookingId', 'date status');

  if (!messages || messages.length === 0) {
      // It's often better to return an empty array than a 404 for list endpoints
      return res.status(200).json([]);
  }
  res.status(200).json(messages);
} catch (error) {  
  res.status(500).json({ message: 'Server error', error: error.message });
}};

// Get messages by booking id
const getMessagesByBooking = async (req, res) => {
const { bookingId } = req.params;
try {  
  //if (req.user.role !== 'admin') {
    //return res.status(403).json({ message: 'Access denied, admin only' });
  //}
  const messages = await Message.find({ bookingId })   //find only those message documents where the field named bookingId exactly matches the value
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .populate('bookingId', 'date status');

  if (!messages || messages.length === 0) {
      // Return an empty array if no messages found for this booking
      return res.status(200).json([]);
    }
  res.status(200).json(messages);
} catch (error) {
  res.status(500).json({ message: 'Server error', error: error.message });
}
};

module.exports = {  getMessagesForUser, getMessagesByBooking ,};