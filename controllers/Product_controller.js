const ProductService = require('../services/Product_serv');

class ProductController {
  // Create product
  static async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all products
  static async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {};

      if (req.query.category) filters.category = req.query.category;
      if (req.query.name) filters.name = req.query.name;
      if (req.query.artisanId) filters.artisanId = req.query.artisanId;
      if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice);
      if (req.query.status) filters.status = req.query.status;
      if (req.query.minStock) filters.minStock = parseInt(req.query.minStock);

      const result = await ProductService.getAllProducts(page, limit, filters);
      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get product by ID
  static async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product by ID
  static async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete product by ID
  static async deleteProduct(req, res) {
    try {
      const result = await ProductService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get products by category
  static async getProductsByCategory(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await ProductService.getProductsByCategory(req.params.category, page, limit);
      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get products by artisan
  static async getProductsByArtisan(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await ProductService.getProductsByArtisan(req.params.artisanId, page, limit);
      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product stock
  static async updateProductStock(req, res) {
    try {
      const { stockChange } = req.body;
      if (stockChange === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Stock change value is required'
        });
      }

      const product = await ProductService.updateProductStock(req.params.id, stockChange);
      res.status(200).json({
        success: true,
        message: 'Product stock updated successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get low stock products
  static async getLowStockProducts(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 5;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await ProductService.getLowStockProducts(threshold, page, limit);
      res.status(200).json({
        success: true,
        message: 'Low stock products retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Search products
  static async searchProducts(req, res) {
    try {
      const searchTerm = req.query.q;
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await ProductService.searchProducts(searchTerm, page, limit);
      res.status(200).json({
        success: true,
        message: 'Products search completed successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get product categories
  static async getProductCategories(req, res) {
    try {
      const categories = await ProductService.getProductCategories();
      res.status(200).json({
        success: true,
        message: 'Product categories retrieved successfully',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get featured products
  static async getFeaturedProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await ProductService.getFeaturedProducts(page, limit);
      res.status(200).json({
        success: true,
        message: 'Featured products retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product images
  static async updateProductImages(req, res) {
    try {
      const { images } = req.body;
      if (!images || !Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: 'Images array is required'
        });
      }

      const product = await ProductService.updateProductImages(req.params.id, images);
      res.status(200).json({
        success: true,
        message: 'Product images updated successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Add product images
  static async addProductImages(req, res) {
    try {
      const { images } = req.body;
      if (!images || !Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: 'Images array is required'
        });
      }

      const product = await ProductService.addProductImages(req.params.id, images);
      res.status(200).json({
        success: true,
        message: 'Product images added successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Remove product image
  static async removeProductImage(req, res) {
    try {
      const product = await ProductService.removeProductImage(req.params.id, req.params.imageId);
      res.status(200).json({
        success: true,
        message: 'Product image removed successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get popular products
  static async getPopularProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const result = await ProductService.getPopularProducts(limit);
      res.status(200).json({
        success: true,
        message: 'Popular products retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProductController;
