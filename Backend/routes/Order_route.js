const express = require('express');
const OrderController = require('../controllers/Order_controller');
const router = express.Router();

// Basic CRUD Operations
router.post('/', OrderController.createOrder);
router.get('/', OrderController.getAllOrders);

// Order number operations
router.get('/order-number/:orderNumber', OrderController.getOrderByNumber);

// User-specific operations
router.get('/buyer/:buyerId', OrderController.getOrdersByBuyer);
router.get('/artisan/:artisanId', OrderController.getOrdersByArtisan);

// Status-based operations
router.get('/status/:status', OrderController.getOrdersByStatus);

// Payment operations
router.get('/payment-status/:paymentStatus', OrderController.getOrdersByPaymentStatus);

// Shipping operations
router.get('/shipping/pending', OrderController.getPendingShipments);

// Analytics and reporting
router.get('/analytics/total-amount', OrderController.getTotalOrderAmount);
router.get('/analytics/by-date-range', OrderController.getOrdersByDateRange);
router.get('/analytics/summary', OrderController.getOrderSummary);

// Search operations
router.get('/search/orders', OrderController.searchOrders);

// ID-based operations (must come after specific routes)
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);
router.patch('/:id/status', OrderController.updateOrderStatus);
router.patch('/:id/payment-status', OrderController.updatePaymentStatus);

// Order items management
router.post('/:id/items', OrderController.addOrderItem);
router.put('/:id/items/:itemId', OrderController.updateOrderItem);
router.delete('/:id/items/:itemId', OrderController.removeOrderItem);

// Shipping operations
router.patch('/:id/shipping-address', OrderController.updateShippingAddress);

module.exports = router;
