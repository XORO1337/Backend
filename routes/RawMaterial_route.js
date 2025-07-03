const express = require('express');
const RawMaterialController = require('../controllers/RawMaterial_controller');
const router = express.Router();

// Basic CRUD Operations
router.post('/', RawMaterialController.createRawMaterialOrder);
router.get('/', RawMaterialController.getAllRawMaterialOrders);
router.get('/:id', RawMaterialController.getRawMaterialOrderById);
router.put('/:id', RawMaterialController.updateRawMaterialOrder);
router.delete('/:id', RawMaterialController.deleteRawMaterialOrder);

// Order number operations
router.get('/order-number/:orderNumber', RawMaterialController.getRawMaterialOrderByOrderNumber);

// Artisan-specific operations
router.get('/artisan/:artisanId', RawMaterialController.getRawMaterialOrdersByArtisan);

// Status-based operations
router.get('/status/:status', RawMaterialController.getRawMaterialOrdersByStatus);
router.patch('/:id/status', RawMaterialController.updateRawMaterialOrderStatus);

// Payment operations
router.patch('/:id/payment-status', RawMaterialController.updateRawMaterialPaymentStatus);
router.get('/payment-status/:paymentStatus', RawMaterialController.getRawMaterialOrdersByPaymentStatus);

// Order items management
router.post('/:id/items', RawMaterialController.addRawMaterialOrderItem);
router.put('/:id/items/:itemId', RawMaterialController.updateRawMaterialOrderItem);
router.delete('/:id/items/:itemId', RawMaterialController.removeRawMaterialOrderItem);

// Shipping operations
router.patch('/:id/shipping-address', RawMaterialController.updateRawMaterialShippingAddress);
router.get('/shipping/pending', RawMaterialController.getPendingRawMaterialShipments);

// Analytics and reporting
router.get('/analytics/total-amount', RawMaterialController.getTotalRawMaterialOrderAmount);
router.get('/analytics/by-date-range', RawMaterialController.getRawMaterialOrdersByDateRange);
router.get('/analytics/summary', RawMaterialController.getRawMaterialOrderSummary);

// Search operations
router.get('/search/orders', RawMaterialController.searchRawMaterialOrders);

// Bulk operations
router.post('/bulk/create', RawMaterialController.createBulkRawMaterialOrders);
router.patch('/bulk/update-status', RawMaterialController.updateBulkRawMaterialOrderStatus);

module.exports = router;
