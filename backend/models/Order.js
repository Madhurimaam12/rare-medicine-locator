const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Request', 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  userName: String,
  userEmail: String,
  phoneNumber: { 
    type: String,
    default: '' 
  },
  medicineName: String,
  quantity: { 
    type: Number, 
    default: 1 
  },
  totalAmount: { 
    type: Number,
    required: true
  },
  billingAddress: { 
    type: String, 
    required: true 
  },
  paymentStatus: { 
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMode: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'insurance'], 
    default: 'cash' 
  },
  orderDate: { 
    type: Date, 
    default: Date.now
  },
  deliveryByDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  cancelledAt: { 
    type: Date 
  },
  cancelReason: { 
    type: String, 
    default: '' 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    default: null 
  },
  review: { 
    type: String, 
    default: '' 
  },
  reminderDate: { 
    type: Date 
  },
  reminderSent: { 
    type: Boolean, 
    default: false 
  },
  // NEW FIELDS - ADD THESE
  deliveryPartner: { 
    type: String, 
    default: '' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'picked', 'in_transit', 'delivered'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);