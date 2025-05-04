const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
});

module.exports = mongoose.model('Booking', bookingSchema);

//module.exports is a Node.js feature that allows you to export something (like a model) from a file so it can be used in other files here server.js