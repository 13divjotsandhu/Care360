const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // Duration in hours
  //department: {  type: String,     enum: ['Protect', 'Repair', 'Inspect'],     required: true   } 
});

module.exports = mongoose.model('Service', serviceSchema);