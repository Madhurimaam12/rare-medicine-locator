const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  pharmacyId: { type: String, required: true },
  pharmacyName: String,
  userId: { type: String, required: true },
  userName: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  review: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);