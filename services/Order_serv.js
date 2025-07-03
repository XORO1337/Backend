const Order = require('../models/Orders');

class OrderService {
  // Create a new order
  static async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Get all orders with optional pagination and filters
  static async getAllOrders(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.paymentStatus) {
        query.paymentStatus = filters.paymentStatus;
      }
      if (filters.buyerId) {
        query.buyerId = filters.buyerId;
      }
      if (filters.artisanId) {
        query.artisanId = filters.artisanId;
      }
      if (filters.orderNumber) {
        query.orderNumber = { $regex: filters.orderNumber, $options: 'i' };
      }
      if (filters.minAmount && filters.maxAmount) {
        query.totalAmount = { $gte: filters.minAmount, $lte: filters.maxAmount };
      } else if (filters.minAmount) {
        query.totalAmount = { $gte: filters.minAmount };
      } else if (filters.maxAmount) {
        query.totalAmount = { $lte: filters.maxAmount };
      }

      const orders = await Order.find(query)
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments(query);

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Get order by ID
  static async getOrderById(id) {
    try {
      const order = await Order.findById(id)
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber) {
    try {
      const order = await Order.findOne({ orderNumber })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  // Update order by ID
  static async updateOrder(id, updateData) {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');

      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  // Delete order by ID
  static async deleteOrder(id) {
    try {
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        throw new Error('Order not found');
      }
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }

  // Get orders by buyer
  static async getOrdersByBuyer(buyerId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find({ buyerId })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({ buyerId });

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching orders by buyer: ${error.message}`);
    }
  }

  // Get orders by artisan
  static async getOrdersByArtisan(artisanId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find({ artisanId })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({ artisanId });

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching orders by artisan: ${error.message}`);
    }
  }

  // Get orders by status
  static async getOrdersByStatus(status, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find({ status })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({ status });

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching orders by status: ${error.message}`);
    }
  }

  // Update order status
  static async updateOrderStatus(id, status) {
    try {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      )
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');

      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentStatus) {
    try {
      const validStatuses = ['pending', 'completed', 'failed'];
      if (!validStatuses.includes(paymentStatus)) {
        throw new Error('Invalid payment status');
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true, runValidators: true }
      )
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');

      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
  }

  // Get order statistics
  static async getOrderStatistics(filters = {}) {
    try {
      const query = {};
      
      if (filters.artisanId) {
        query.artisanId = filters.artisanId;
      }
      if (filters.buyerId) {
        query.buyerId = filters.buyerId;
      }
      if (filters.startDate && filters.endDate) {
        query.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      const totalOrders = await Order.countDocuments(query);
      const completedOrders = await Order.countDocuments({ ...query, status: 'delivered' });
      const pendingOrders = await Order.countDocuments({ ...query, status: 'pending' });
      const cancelledOrders = await Order.countDocuments({ ...query, status: 'cancelled' });

      const totalRevenue = await Order.aggregate([
        { $match: { ...query, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      return {
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      };
    } catch (error) {
      throw new Error(`Error fetching order statistics: ${error.message}`);
    }
  }

  // Search orders
  static async searchOrders(searchTerm, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchRegex = { $regex: searchTerm, $options: 'i' };
      
      const query = {
        $or: [
          { orderNumber: searchRegex },
          { 'shippingAddress.city': searchRegex },
          { 'shippingAddress.state': searchRegex }
        ]
      };

      const orders = await Order.find(query)
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments(query);

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error searching orders: ${error.message}`);
    }
  }

  // Update shipping address
  static async updateShippingAddress(id, shippingAddress) {
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { shippingAddress },
        { new: true, runValidators: true }
      )
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');

      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Error updating shipping address: ${error.message}`);
    }
  }

  // Get recent orders
  static async getRecentOrders(days = 7, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const orders = await Order.find({
        createdAt: { $gte: startDate }
      })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({
        createdAt: { $gte: startDate }
      });

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching recent orders: ${error.message}`);
    }
  }

  // Add order item
  static async addOrderItem(id, itemData) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      order.items.push(itemData);
      
      // Recalculate total amount
      let totalAmount = 0;
      for (const item of order.items) {
        totalAmount += item.quantity * item.price;
      }
      order.totalAmount = totalAmount;

      await order.save();

      return await Order.findById(id)
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');
    } catch (error) {
      throw new Error(`Error adding order item: ${error.message}`);
    }
  }

  // Update order item
  static async updateOrderItem(id, itemId, updateData) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      const itemIndex = order.items.findIndex(item => item._id.toString() === itemId);
      if (itemIndex === -1) {
        throw new Error('Order item not found');
      }

      Object.assign(order.items[itemIndex], updateData);
      
      // Recalculate total amount
      let totalAmount = 0;
      for (const item of order.items) {
        totalAmount += item.quantity * item.price;
      }
      order.totalAmount = totalAmount;

      await order.save();

      return await Order.findById(id)
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');
    } catch (error) {
      throw new Error(`Error updating order item: ${error.message}`);
    }
  }

  // Remove order item
  static async removeOrderItem(id, itemId) {
    try {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      order.items = order.items.filter(item => item._id.toString() !== itemId);
      
      // Recalculate total amount
      let totalAmount = 0;
      for (const item of order.items) {
        totalAmount += item.quantity * item.price;
      }
      order.totalAmount = totalAmount;

      await order.save();

      return await Order.findById(id)
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category');
    } catch (error) {
      throw new Error(`Error removing order item: ${error.message}`);
    }
  }

  // Get pending shipments
  static async getPendingShipments(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({ 
        status: { $in: ['pending', 'processing'] }
      })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({ 
        status: { $in: ['pending', 'processing'] }
      });

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching pending shipments: ${error.message}`);
    }
  }

  // Get total order amount
  static async getTotalOrderAmount(startDate, endDate) {
    try {
      const matchConditions = {};
      
      if (startDate && endDate) {
        matchConditions.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const result = await Order.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        }
      ]);

      return result[0] || { totalAmount: 0, orderCount: 0 };
    } catch (error) {
      throw new Error(`Error calculating total order amount: ${error.message}`);
    }
  }

  // Get orders by date range
  static async getOrdersByDateRange(startDate, endDate, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const orders = await Order.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      })
        .populate('buyerId', 'name email phone')
        .populate('artisanId', 'name email phone')
        .populate('items.productId', 'name price category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Order.countDocuments({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });

      return {
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total
      };
    } catch (error) {
      throw new Error(`Error fetching orders by date range: ${error.message}`);
    }
  }

  // Get order summary
  static async getOrderSummary(period = 'daily') {
    try {
      let groupBy = {};
      let dateFormat = '';

      switch (period) {
        case 'daily':
          dateFormat = '%Y-%m-%d';
          groupBy = {
            $dateToString: { format: dateFormat, date: '$createdAt' }
          };
          break;
        case 'weekly':
          groupBy = {
            $concat: [
              { $toString: { $year: '$createdAt' } },
              '-W',
              { $toString: { $week: '$createdAt' } }
            ]
          };
          break;
        case 'monthly':
          dateFormat = '%Y-%m';
          groupBy = {
            $dateToString: { format: dateFormat, date: '$createdAt' }
          };
          break;
        default:
          throw new Error('Invalid period. Use daily, weekly, or monthly');
      }

      const summary = await Order.aggregate([
        {
          $group: {
            _id: groupBy,
            totalOrders: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
            averageOrderValue: { $avg: '$totalAmount' },
            statuses: {
              $push: '$status'
            }
          }
        },
        {
          $addFields: {
            pendingOrders: {
              $size: {
                $filter: {
                  input: '$statuses',
                  cond: { $eq: ['$$this', 'pending'] }
                }
              }
            },
            completedOrders: {
              $size: {
                $filter: {
                  input: '$statuses',
                  cond: { $eq: ['$$this', 'delivered'] }
                }
              }
            }
          }
        },
        {
          $project: {
            statuses: 0
          }
        },
        {
          $sort: { _id: -1 }
        }
      ]);

      return summary;
    } catch (error) {
      throw new Error(`Error generating order summary: ${error.message}`);
    }
  }
}

module.exports = OrderService;
