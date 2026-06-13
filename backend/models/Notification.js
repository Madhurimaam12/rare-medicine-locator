const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: String,
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['request', 'status_change', 'stock_update', 'alert'], default: 'request' },
  isRead: { type: Boolean, default: false },
  relatedId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);