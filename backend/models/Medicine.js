const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  genericName: String,
  manufacturer: String,
  price: Number,
  stock: {
     type: Number, 
     default: 0 
    },
  location: String,
  pharmacyId: { 
    type: String, 
    required: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);