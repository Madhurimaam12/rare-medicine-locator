const Request = require('../models/Request');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');

// Create request (notify pharmacies)
exports.createRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    
    const pharmacies = await User.find({ role: 'pharmacy' });
    for (const pharmacy of pharmacies) {
      const notification = new Notification({
        userId: pharmacy._id,
        userName: pharmacy.name,
        title: 'New Medicine Request',
        message: `${request.userName} requested "${request.medicineName}" (Urgency: ${request.urgency})`,
        type: 'request',
        relatedId: request._id
      });
      await notification.save();
    }
    
    res.status(201).json({ message: 'Request submitted successfully! Notification sent to pharmacies.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit request', error: error.message });
  }
};

// Get user requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Get all requests (for pharmacy)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Helper: create order from approved request
const createOrderFromRequest = async (request) => {
  try {
    const medicine = await Medicine.findOne({ name: request.medicineName });
    const price = medicine ? medicine.price : 0;
    const totalAmount = price;

    // Calculate delivery by date (7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const order = new Order({
      requestId: request._id,
      userId: request.userId,
      userName: request.userName,
      userEmail: request.userEmail,
      phoneNumber: request.phoneNumber,
      medicineName: request.medicineName,
      quantity: 1,
      totalAmount,
      billingAddress: request.billingAddress,
      paymentStatus: 'pending',
      paymentMode: 'cash',
      deliveryByDate: deliveryDate,
      status: 'pending'
    });
    await order.save();
    console.log('Order created for request:', request._id);

    const notification = new Notification({
      userId: request.userId,
      userName: request.userName,
      title: 'Order Created',
      message: `Your request for ${request.medicineName} has been approved. Order total: ₹${totalAmount}. Expected delivery by ${deliveryDate.toLocaleDateString()}.`,
      type: 'status_change',
      relatedId: order._id
    });
    await notification.save();

    return order;
  } catch (error) {
    console.error('Order creation failed:', error);
    return null;
  }
};

// Update request status (notify user and create order if approved)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (status === 'approved') {
      await createOrderFromRequest(request);
    }

    const notification = new Notification({
      userId: request.userId,
      userName: request.userName,
      title: status === 'approved' ? 'Request Approved!' : 'Request Rejected',
      message: status === 'approved' 
        ? `Your request for "${request.medicineName}" has been approved. An order has been created.`
        : `Sorry, your request for "${request.medicineName}" could not be fulfilled at this time.`,
      type: 'status_change',
      relatedId: request._id
    });
    await notification.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
};