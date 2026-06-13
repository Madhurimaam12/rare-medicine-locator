const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/auth');

// Get all orders (pharmacy only)
router.get('/', verifyToken, orderController.getAllOrders);

// Get user orders with filters
router.get('/user/:userId/filter', verifyToken, orderController.getUserOrdersWithFilters);

// Get user orders (basic)
router.get('/user/:userId', verifyToken, orderController.getUserOrders);

// Update payment status
router.put('/:id/payment', verifyToken, orderController.updatePaymentStatus);

// Update payment mode
router.put('/:id/payment-mode', verifyToken, orderController.updatePaymentMode);

// Update delivery date
router.put('/:id/delivery-date', verifyToken, orderController.updateDeliveryDate);

// Update order status
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

// Update order details (phone & address)
router.put('/:id/update-details', verifyToken, orderController.updateOrderDetails);

// Cancel order
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

// Add rating and review
router.put('/:id/rating', verifyToken, orderController.addRating);

// Set medicine reminder
router.put('/:id/reminder', verifyToken, orderController.setReminder);

// Delivery Partner Routes 
router.put('/:id/delivery-partner', verifyToken, orderController.assignDeliveryPartner);
router.put('/:id/delivery-status', verifyToken, orderController.updateDeliveryStatus);

module.exports = router;