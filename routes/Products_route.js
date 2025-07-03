const express = require('express');
const ProductController = require('../controllers/Product_controller');
const router = express.Router();

// Basic CRUD Operations
router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

// Artisan-specific operations
router.get('/artisan/:artisanId', ProductController.getProductsByArtisan);
router.delete('/artisan/:artisanId', ProductController.deleteProductsByArtisan);

// Category-based operations
router.get('/category/:category', ProductController.getProductsByCategory);

// Status-based operations
router.get('/status/:status', ProductController.getProductsByStatus);
router.patch('/:id/status', ProductController.updateProductStatus);

// Stock management
router.patch('/:id/stock', ProductController.updateProductStock);
router.get('/inventory/low-stock', ProductController.getLowStockProducts);

// Search operations
router.get('/search/products', ProductController.searchProducts);
router.get('/search/by-price-range', ProductController.getProductsByPriceRange);

// Image management
router.post('/:id/images', ProductController.addProductImages);
router.delete('/:id/images/:imageId', ProductController.removeProductImage);

// Analytics
router.get('/analytics/categories', ProductController.getProductCategories);
router.get('/analytics/popular', ProductController.getPopularProducts);

module.exports = router;
