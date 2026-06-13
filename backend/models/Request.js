const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  medicineName: { 
    type: String, 
    required: true
   },
  userId: 
  { type: String, 
    required: true 
  },
  userName: String,
  userEmail: String,
  phoneNumber: 
  { type: String, 
    default: '' 
  },
  location: String,
  urgency:
   { type:
     String, 
     enum: ['normal', 'high', 'urgent'], 
     default: 'normal' 
    },
  status: 
  { type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  billingAddress: 
  { type: String, 
    default: '' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);