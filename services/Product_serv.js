const Product = require('../models/Product');

class ProductService {
  // Create a new product
  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  // Get all products with optional pagination and filters
  static async getAllProducts(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      // Apply filters
      if (filters.category) {
        query.category = { $regex: filters.category, $options: 'i' };
      }
      if (filters.name) {
        query.name = { $regex: filters.name, $options: 'i' };
      }
      if (filters.artisanId) {
        query.artisanId = filters.artisanId;
      }
      if (filters.minPrice && filters.maxPrice) {
        query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
      } else if (filters.minPrice) {
        query.price = { $gte: filters.minPrice };
      } else if (filters.maxPrice) {
        query.price = { $lte: filters.maxPrice };
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.minStock !== undefined) {
        query.stock = { $gte: filters.minStock };
      }

      const products = await Product.find(query)
        .populate('artisanId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);

      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const product = await Product.findById(id)
        .populate('artisanId', 'name email phone');
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Update product by ID
  static async updateProduct(id, updateData) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('artisanId', 'name email phone');

      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  // Delete product by ID
  static async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  // Get products by category
  static async getProductsByCategory(category, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find({ 
        category: { $regex: category, $options: 'i' } 
      })
        .populate('artisanId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({ 
        category: { $regex: category, $options: 'i' } 
      });

      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  // Get products by artisan
  static async getProductsByArtisan(artisanId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find({ artisanId })
        .populate('artisanId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({ artisanId });

      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching products by artisan: ${error.message}`);
    }
  }

  // Update product stock
  static async updateProductStock(id, stockChange) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      const newStock = product.stock + stockChange;
      if (newStock < 0) {
        throw new Error('Insufficient stock');
      }

      product.stock = newStock;
      
      // Update status based on stock
      if (newStock === 0) {
        product.status = 'out_of_stock';
      } else if (product.status === 'out_of_stock') {
        product.status = 'active';
      }

      await product.save();

      return await Product.findById(id)
        .populate('artisanId', 'name email phone');
    } catch (error) {
      throw new Error(`Error updating product stock: ${error.message}`);
    }
  }

  // Get low stock products
  static async getLowStockProducts(threshold = 5, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find({ 
        stock: { $lte: threshold },
        status: { $ne: 'discontinued' }
      })
        .populate('artisanId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ stock: 1 });

      const total = await Product.countDocuments({ 
        stock: { $lte: threshold },
        status: { $ne: 'discontinued' }
      });

      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching low stock products: ${error.message}`);
    }
  }

  // Search products
  static async searchProducts(searchTerm, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchRegex = { $regex: searchTerm, $options: 'i' };
      
      const query = {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      };

      const products = await Product.find(query)
        .populate('artisanId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments(query);

      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }

  // Get product categories
  static async getProductCategories() {
    try {
      const categories = await Product.distinct('category');
      return categories;
    } catch (error) {
      throw new Error(`Error fetching product categories: ${error.message}`);
    }
  }

  // Get featured products (top selling or recently added)
  static async getFeaturedProducts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find({ 
        status: 'active',
        stock: { $gt: 0 }
      })
        .populate('artisanId', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({ 
        status: 'active',
        stock: { $gt: 0 }
      });

      return {
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching featured products: ${error.message}`);
    }
  }

  // Update product images
  static async updateProductImages(id, images) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { images },
        { new: true, runValidators: true }
      ).populate('artisanId', 'name email phone');

      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Error updating product images: ${error.message}`);
    }
  }

  // Add product images
  static async addProductImages(id, images) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { $addToSet: { images: { $each: images } } },
        { new: true, runValidators: true }
      ).populate('artisanId', 'name email phone');

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw new Error(`Error adding product images: ${error.message}`);
    }
  }

  // Remove product image
  static async removeProductImage(id, imageUrl) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { $pull: { images: imageUrl } },
        { new: true, runValidators: true }
      ).populate('artisanId', 'name email phone');

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      throw new Error(`Error removing product image: ${error.message}`);
    }
  }

  // Get popular products (based on a simple popularity metric)
  static async getPopularProducts(limit = 10) {
    try {
      // For now, we'll sort by creation date as a proxy for popularity
      // In a real application, this would be based on sales, views, etc.
      const products = await Product.find({ status: 'active' })
        .populate('artisanId', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(limit);

      return products;
    } catch (error) {
      throw new Error(`Error fetching popular products: ${error.message}`);
    }
  }
}

module.exports = ProductService;
