import { 
  artisanAPI, 
  distributorAPI, 
  productsAPI, 
  ordersAPI, 
  rawMaterialsAPI, 
  inventoryAPI,
  verificationAPI,
  authAPI 
} from './api';

// Dashboard Services for different user roles
export const dashboardService = {
  // Common dashboard data
  async getDashboardStats(userRole) {
    try {
      const stats = {};
      
      if (userRole === 'artisan') {
        // Get artisan-specific stats
        const [products, orders, materials] = await Promise.all([
          productsAPI.getProducts('mine=true'),
          ordersAPI.getOrders('artisan=true'),
          rawMaterialsAPI.getRawMaterials()
        ]);
        
        stats.totalProducts = products.data?.length || 0;
        stats.totalOrders = orders.data?.length || 0;
        stats.pendingOrders = orders.data?.filter(o => o.status === 'pending').length || 0;
        stats.totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        
      } else if (userRole === 'distributor') {
        // Get distributor-specific stats
        const [inventory, orders, products] = await Promise.all([
          inventoryAPI.getInventory(),
          ordersAPI.getOrders('distributor=true'),
          productsAPI.getProducts('distributor=true')
        ]);
        
        stats.totalInventory = inventory.data?.length || 0;
        stats.totalOrders = orders.data?.length || 0;
        stats.lowStockItems = inventory.data?.filter(i => i.quantity < i.minQuantity).length || 0;
        stats.totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      }
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return { success: false, message: error.message };
    }
  },

  // Get recent activities
  async getRecentActivities(userRole, limit = 5) {
    try {
      const activities = [];
      
      if (userRole === 'artisan') {
        const orders = await ordersAPI.getOrders(`artisan=true&limit=${limit}&sort=-createdAt`);
        activities.push(...(orders.data || []).map(order => ({
          type: 'order',
          message: `New order #${order.orderNumber} received`,
          timestamp: order.createdAt,
          status: order.status
        })));
        
      } else if (userRole === 'distributor') {
        const orders = await ordersAPI.getOrders(`distributor=true&limit=${limit}&sort=-createdAt`);
        activities.push(...(orders.data || []).map(order => ({
          type: 'order',
          message: `Order #${order.orderNumber} processed`,
          timestamp: order.createdAt,
          status: order.status
        })));
      }
      
      return { success: true, data: activities };
    } catch (error) {
      console.error('Get recent activities error:', error);
      return { success: false, message: error.message };
    }
  }
};

// Artisan Dashboard Service
export const artisanDashboardService = {
  // Get artisan profile and products
  async getArtisanData() {
    try {
      const [profile, products, orders] = await Promise.all([
        authAPI.getProfile(),
        productsAPI.getProducts('mine=true'),
        ordersAPI.getOrders('artisan=true')
      ]);
      
      return {
        success: true,
        data: {
          profile: profile.data,
          products: products.data || [],
          orders: orders.data || []
        }
      };
    } catch (error) {
      console.error('Get artisan data error:', error);
      return { success: false, message: error.message };
    }
  },

  // Get raw materials for artisan
  async getRawMaterials() {
    try {
      const response = await rawMaterialsAPI.getRawMaterials();
      return response;
    } catch (error) {
      console.error('Get raw materials error:', error);
      return { success: false, message: error.message };
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const response = await productsAPI.createProduct(productData);
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      return { success: false, message: error.message };
    }
  },

  // Update product
  async updateProduct(productId, productData) {
    try {
      const response = await productsAPI.updateProduct(productId, productData);
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, message: error.message };
    }
  },

  // Get verification status
  async getVerificationStatus() {
    try {
      const response = await verificationAPI.getVerificationStatus();
      return response;
    } catch (error) {
      console.error('Get verification status error:', error);
      return { success: false, message: error.message };
    }
  },

  // Initiate identity verification
  async initiateVerification(aadhaarNumber) {
    try {
      const response = await verificationAPI.initiateAadhaarVerification(aadhaarNumber);
      return response;
    } catch (error) {
      console.error('Initiate verification error:', error);
      return { success: false, message: error.message };
    }
  },

  // Verify OTP
  async verifyVerificationOTP(otp) {
    try {
      const response = await verificationAPI.verifyAadhaarOTP(otp);
      return response;
    } catch (error) {
      console.error('Verify verification OTP error:', error);
      return { success: false, message: error.message };
    }
  }
};

// Distributor Dashboard Service
export const distributorDashboardService = {
  // Get distributor profile and inventory
  async getDistributorData() {
    try {
      const [profile, inventory, orders] = await Promise.all([
        authAPI.getProfile(),
        inventoryAPI.getInventory(),
        ordersAPI.getOrders('distributor=true')
      ]);
      
      return {
        success: true,
        data: {
          profile: profile.data,
          inventory: inventory.data || [],
          orders: orders.data || []
        }
      };
    } catch (error) {
      console.error('Get distributor data error:', error);
      return { success: false, message: error.message };
    }
  },

  // Get available products for distribution
  async getAvailableProducts() {
    try {
      const response = await productsAPI.getProducts('available=true');
      return response;
    } catch (error) {
      console.error('Get available products error:', error);
      return { success: false, message: error.message };
    }
  },

  // Add inventory item
  async addInventoryItem(inventoryData) {
    try {
      const response = await inventoryAPI.createInventoryItem(inventoryData);
      return response;
    } catch (error) {
      console.error('Add inventory item error:', error);
      return { success: false, message: error.message };
    }
  },

  // Update inventory item
  async updateInventoryItem(itemId, inventoryData) {
    try {
      const response = await inventoryAPI.updateInventoryItem(itemId, inventoryData);
      return response;
    } catch (error) {
      console.error('Update inventory item error:', error);
      return { success: false, message: error.message };
    }
  },

  // Process order
  async processOrder(orderId, orderData) {
    try {
      const response = await ordersAPI.updateOrder(orderId, orderData);
      return response;
    } catch (error) {
      console.error('Process order error:', error);
      return { success: false, message: error.message };
    }
  }
};

// Customer Dashboard Service
export const customerDashboardService = {
  // Get customer profile and orders
  async getCustomerData() {
    try {
      const [profile, orders, addresses] = await Promise.all([
        authAPI.getProfile(),
        ordersAPI.getOrders('customer=true'),
        addressAPI.getAddresses()
      ]);
      
      return {
        success: true,
        data: {
          profile: profile.data,
          orders: orders.data || [],
          addresses: addresses.data || []
        }
      };
    } catch (error) {
      console.error('Get customer data error:', error);
      return { success: false, message: error.message };
    }
  },

  // Browse marketplace products
  async browseProducts(filters = {}) {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await productsAPI.getProducts(queryString);
      return response;
    } catch (error) {
      console.error('Browse products error:', error);
      return { success: false, message: error.message };
    }
  },

  // Place order
  async placeOrder(orderData) {
    try {
      const response = await ordersAPI.createOrder(orderData);
      return response;
    } catch (error) {
      console.error('Place order error:', error);
      return { success: false, message: error.message };
    }
  }
};

// Real-time updates service
export const realtimeService = {
  // Initialize WebSocket connection for real-time updates
  initializeConnection(userId, onMessage) {
    // This would be implemented with Socket.io or WebSocket
    // For now, we'll use polling
    const pollInterval = setInterval(async () => {
      try {
        // Poll for updates every 30 seconds
        const updates = await this.checkForUpdates(userId);
        if (updates.data && updates.data.length > 0) {
          onMessage(updates.data);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 30000);

    return {
      disconnect: () => clearInterval(pollInterval)
    };
  },

  async checkForUpdates(userId) {
    try {
      // Check for new orders, messages, etc.
      const response = await fetch(`/api/updates/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Check updates error:', error);
      return { success: false, message: error.message };
    }
  }
};

export default {
  dashboardService,
  artisanDashboardService,
  distributorDashboardService,
  customerDashboardService,
  realtimeService
};
