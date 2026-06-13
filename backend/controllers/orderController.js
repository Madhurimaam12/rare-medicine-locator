const Order = require('../models/Order');
const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Email transporter setup (using Ethereal for testing - replace with real SMTP for production)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'your-ethereal-email@ethereal.email',
    pass: 'your-ethereal-password'
  }
});

// Send order confirmation email
const sendOrderConfirmation = async (order, userEmail) => {
  try {
    await transporter.sendMail({
      from: '"Rare Medicine Locator" <noreply@raremedicine.com>',
      to: userEmail,
      subject: `Order Confirmation - ${order.medicineName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563EB;">Order Confirmation</h2>
          <p>Dear ${order.userName},</p>
          <p>Your order for <strong>${order.medicineName}</strong> has been confirmed.</p>
          <p><strong>Order ID:</strong> ${order._id.slice(-8)}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount?.toLocaleString()}</p>
          <p><strong>Delivery By:</strong> ${new Date(order.deliveryByDate).toLocaleDateString()}</p>
          <p>Thank you for choosing Rare Medicine Locator!</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};

// Send cancellation notification to user
const sendCancellationNotification = async (order, cancelReason) => {
  try {
    const notification = new Notification({
      userId: order.userId,
      userName: order.userName,
      title: 'Order Cancelled',
      message: `Your order for ${order.medicineName} has been cancelled. Reason: ${cancelReason || 'Requested by user'}`,
      type: 'alert',
      relatedId: order._id
    });
    await notification.save();
    console.log('Cancellation notification sent to user:', order.userName);
  } catch (error) {
    console.error('Failed to send cancellation notification:', error);
  }
};

// Get all orders (for pharmacy)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get user orders with filters
exports.getUserOrdersWithFilters = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { userId: req.params.userId };
    if (status && status !== 'all') {
      filter.status = status;
    }
    const orders = await Order.find(filter).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Get user orders (basic)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    
    // Send notification to user about payment status change
    if (paymentStatus === 'paid') {
      const notification = new Notification({
        userId: order.userId,
        userName: order.userName,
        title: 'Payment Received',
        message: `Payment of ₹${order.totalAmount?.toLocaleString()} has been received for ${order.medicineName}.`,
        type: 'alert',
        relatedId: order._id
      });
      await notification.save();
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
};

// Update payment mode
exports.updatePaymentMode = async (req, res) => {
  try {
    const { paymentMode } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMode },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment mode', error: error.message });
  }
};

// Update delivery date
exports.updateDeliveryDate = async (req, res) => {
  try {
    const { deliveryByDate } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryByDate },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update delivery date', error: error.message });
  }
};

// Update order status - ALSO syncs delivery status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // If order status is "delivered", also update delivery status
    let updateFields = { status };
    if (status === 'delivered') {
      updateFields.deliveryStatus = 'delivered';
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    
    // Send confirmation email when status changes to confirmed
    if (status === 'confirmed' && order.userEmail) {
      await sendOrderConfirmation(order, order.userEmail);
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Update order details (phone & address)
exports.updateOrderDetails = async (req, res) => {
  try {
    const { phoneNumber, billingAddress } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { phoneNumber, billingAddress },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order details', error: error.message });
  }
};

// Cancel order with notification
exports.cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: cancelReason || 'No reason provided'
      },
      { new: true }
    );
    
    // Send notification to user about cancellation
    await sendCancellationNotification(order, cancelReason);
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};

// Add rating and review
exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add rating', error: error.message });
  }
};

// Set medicine reminder
exports.setReminder = async (req, res) => {
  try {
    const { reminderDate } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { reminderDate },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to set reminder', error: error.message });
  }
};

// Assign delivery partner
exports.assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartner } = req.body;
    console.log('Assigning delivery partner to order:', req.params.id, 'Partner:', deliveryPartner);
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryPartner: deliveryPartner || '' },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Assign delivery partner error:', error);
    res.status(500).json({ message: 'Failed to assign delivery partner', error: error.message });
  }
};

// Update delivery status - ALSO syncs order status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    console.log('Updating delivery status for order:', req.params.id, 'Status:', deliveryStatus);
    
    // If delivery status is "delivered", also update order status
    let updateFields = { deliveryStatus };
    if (deliveryStatus === 'delivered') {
      updateFields.status = 'delivered';
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('Delivery status updated successfully');
    res.json(order);
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Failed to update delivery status', error: error.message });
  }
};